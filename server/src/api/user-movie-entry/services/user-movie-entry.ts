/**
 * user-movie-entry service
 */

import { factories } from "@strapi/strapi";
import { USER_MOVIE_ENTRY_UID } from "../../../constants";

export default factories.createCoreService(USER_MOVIE_ENTRY_UID, ({ strapi }) => ({
  async findByUserAndMovie(userId: number, movieId: number) {
    return strapi.db.query(USER_MOVIE_ENTRY_UID).findOne({
      where: {
        users_permissions_user: userId,
        movie: movieId,
      },
    });
  },
}));
