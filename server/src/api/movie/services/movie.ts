/**
 * movie service
 */

import { factories } from "@strapi/strapi";
import { MOVIE_UID } from "../../../constants";

export default factories.createCoreService(MOVIE_UID, ({ strapi }) => ({
  async findByTmdbId(tmdbId: number) {
    return strapi.documents(MOVIE_UID).findFirst({
      filters: { tmdbId: { $eq: tmdbId } } as any,
    });
  },
}));
