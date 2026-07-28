/**
 * movie controller
 */

import { factories } from "@strapi/strapi";
import { MOVIE_UID, USER_MOVIE_ENTRY_UID } from "../../../constants";
import {
  searchMovies,
  getMovieDetails,
  TmdbRequestError,
} from "../services/tmdb";

export default factories.createCoreController(MOVIE_UID, ({ strapi }) => ({
  async search(ctx) {
    const { query, page = 1 } = ctx.query as {
      query?: string;
      page?: number;
    };
    const userId = ctx.state.user?.id;

    if (!query || !query.trim()) {
      return ctx.badRequest('The "query" parameter is required');
    }

    if (!userId) {
      return ctx.unauthorized("You must be authenticated to search");
    }

    let tmdbData: Awaited<ReturnType<typeof searchMovies>>;
    try {
      tmdbData = await searchMovies(query, page);
    } catch (err) {
      strapi.log.error("Error calling TMDB:", err);
      return ctx.internalServerError("Error fetching data from TMDB");
    }

    const tmdbIds = tmdbData.results.map((movie) => movie.id);

    const existingEntries = await strapi.db
      .query(USER_MOVIE_ENTRY_UID)
      .findMany({
        where: {
          users_permissions_user: userId,
          movie: { tmdbId: { $in: tmdbIds } },
        },
        populate: { movie: true },
      });

    const statusByTmdbId: Record<number, string> = {};
    const releaseDateByTmdbId: Record<number, string | null> = {};
    (existingEntries as any[]).forEach((entry: any) => {
      if (entry.movie?.tmdbId) {
        statusByTmdbId[entry.movie.tmdbId] = entry.watchStatus;
        releaseDateByTmdbId[entry.movie.tmdbId] = entry.movie.releaseDate;
      }
    });

    const results = tmdbData.results.map((movie: any) => ({
      tmdbId: movie.id,
      title: movie.title,
      year: movie.release_date ? movie.release_date.slice(0, 4) : null,
      releaseDate: releaseDateByTmdbId[movie.id] ?? movie.release_date ?? null,
      posterPath: movie.poster_path,
      status: statusByTmdbId[movie.id] || null,
    }));

    return ctx.send({
      page: tmdbData.page,
      totalPages: tmdbData.total_pages,
      totalResults: tmdbData.total_results,
      results,
    });
  },

  async mark(ctx) {
    const { tmdbId, watchStatus, rating, notes } = ctx.request.body as {
      tmdbId?: number;
      watchStatus?: string;
      rating?: number;
      notes?: string;
    };
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized("You must be authenticated to mark a movie");
    }
    if (!tmdbId) {
      return ctx.badRequest('The "tmdbId" field is required');
    }
    if (!["watched", "watchlist"].includes(watchStatus || "")) {
      return ctx.badRequest(
        '"watchStatus" must be either "watched" or "watchlist"',
      );
    }

    // 1. Find or create the Movie
    let movie: any = await (strapi.service(MOVIE_UID) as any).findByTmdbId(
      tmdbId,
    );

    if (!movie) {
      let details: Awaited<ReturnType<typeof getMovieDetails>>;
      try {
        details = await getMovieDetails(tmdbId);
      } catch (err) {
        if (err instanceof TmdbRequestError) {
          return ctx.badRequest("Movie not found on TMDB");
        }
        strapi.log.error("Error calling TMDB:", err);
        return ctx.internalServerError(
          "Error fetching movie details from TMDB",
        );
      }

      movie = await strapi.documents(MOVIE_UID).create({
        data: {
          tmdbId: details.id,
          title: details.title,
          posterPath: details.poster_path,
          releaseDate: details.release_date || null,
          runtime: details.runtime || null,
          genres: (details.genres || []).map((g) => g.name),
        } as any,
      });
    }

    // 1.5. Business rule: a movie can't be marked as "watched" before its release date
    if (watchStatus === "watched") {
      const today = new Date().toISOString().slice(0, 10);
      if (movie.releaseDate && movie.releaseDate > today) {
        return ctx.badRequest(
          "This movie has not been released yet and cannot be marked as watched",
        );
      }
    }

    // 2. Create or update the entry (never deletes)
    try {
      const existingEntry = await (
        strapi.service(USER_MOVIE_ENTRY_UID) as any
      ).findByUserAndMovie(userId, movie.id);

      if (!existingEntry) {
        const entry = await strapi.db.query(USER_MOVIE_ENTRY_UID).create({
          data: {
            movie: movie.id,
            users_permissions_user: userId,
            watchStatus,
            rating: rating ?? null,
            notes: notes ?? null,
          },
        });

        return ctx.send({ action: "created", entry });
      }

      if (existingEntry.watchStatus === watchStatus) {
        return ctx.send({ action: "unchanged", entry: existingEntry });
      }

      const updateData: any = {
        watchStatus,
        dateWatched: watchStatus === "watched" ? new Date() : null,
      };
      if (rating !== undefined) updateData.rating = rating;
      if (notes !== undefined) updateData.notes = notes;

      const updatedEntry = await strapi.db.query(USER_MOVIE_ENTRY_UID).update({
        where: { id: existingEntry.id },
        data: updateData,
      });

      return ctx.send({ action: "updated", entry: updatedEntry });
    } catch (err: any) {
      strapi.log.error("Error creating/updating UserMovieEntry:", err);
      return ctx.badRequest(err.message || "Could not process entry");
    }
  },

  async unmark(ctx) {
    const { tmdbId } = ctx.params as { tmdbId?: string };
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized("You must be authenticated to unmark a movie");
    }
    if (!tmdbId) {
      return ctx.badRequest('The "tmdbId" parameter is required');
    }

    const movie: any = await (strapi.service(MOVIE_UID) as any).findByTmdbId(
      Number(tmdbId),
    );

    if (!movie) {
      return ctx.notFound("Movie not found");
    }

    const existingEntry = await (
      strapi.service(USER_MOVIE_ENTRY_UID) as any
    ).findByUserAndMovie(userId, movie.id);

    if (!existingEntry) {
      return ctx.notFound("No tracking entry found for this movie");
    }

    await strapi.db
      .query(USER_MOVIE_ENTRY_UID)
      .delete({ where: { id: existingEntry.id } });

    return ctx.send({ action: "deleted" });
  },
}));
