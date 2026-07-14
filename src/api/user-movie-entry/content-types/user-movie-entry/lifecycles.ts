export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    validateRating(data.rating);
    await assertNoDuplicate(data.users_permissions_user, data.movie);

    data.dateAdded = new Date();

    if (data.watchStatus === "watched" && !data.dateWatched) {
      data.dateWatched = new Date();
    }
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;
    if (data.rating !== undefined) validateRating(data.rating);
  },
};

function validateRating(rating: number | null | undefined) {
  if (rating === undefined || rating === null) return;
  if (rating < 0 || rating > 5 || (rating * 2) % 1 !== 0) {
    throw new Error("rating must be between 0 and 5, in steps of 0.5");
  }
}

async function assertNoDuplicate(userId: number, movieId: number) {
  if (!userId || !movieId) return;

  const existing = await strapi.db
    .query("api::user-movie-entry.user-movie-entry")
    .findOne({
      where: {
        users_permissions_user: userId,
        movie: movieId,
      },
    });

  if (existing) {
    throw new Error("An entry already exists for this movie and user");
  }
}
