/**
 * user-movie-entry controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::user-movie-entry.user-movie-entry",
  ({ strapi }) => ({
    async find(ctx) {
      const userId = ctx.state.user?.id;

      if (!userId) {
        return ctx.unauthorized("You must be authenticated");
      }

      const filters = (ctx.query.filters as any) || {};
      const page = Number((ctx.query.pagination as any)?.page) || 1;
      const pageSize = Number((ctx.query.pagination as any)?.pageSize) || 10;
      const sortParam = (ctx.query.sort as string) || "dateAdded:desc";
      const [sortField, sortOrder] = sortParam.split(":");

      const where: any = {
        users_permissions_user: userId,
      };

      if (filters.watchStatus) {
        where.watchStatus = filters.watchStatus;
      }

      // Nested filter support: filters[movie][releaseDate][$gt]=...
      if (filters.movie?.releaseDate) {
        where.movie = { releaseDate: filters.movie.releaseDate };
      }

      const total = await strapi.db
        .query("api::user-movie-entry.user-movie-entry")
        .count({ where });

      const entries = await strapi.db
        .query("api::user-movie-entry.user-movie-entry")
        .findMany({
          where,
          populate: { movie: true },
          orderBy: sortField.includes(".")
            ? { movie: { [sortField.split(".")[1]]: sortOrder || "asc" } }
            : { [sortField]: sortOrder || "desc" },
          limit: pageSize,
          offset: (page - 1) * pageSize,
        });

      return ctx.send({
        data: entries,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      });
    },
  }),
);
