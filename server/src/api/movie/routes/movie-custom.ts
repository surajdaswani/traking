/**
 * movie custom router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/movies/search",
      handler: "movie.search",
      config: { policies: [] },
    },
    {
      method: "POST",
      path: "/movies/mark",
      handler: "movie.mark",
      config: { policies: [] },
    },
    {
      method: "DELETE",
      path: "/movies/:tmdbId/entry",
      handler: "movie.unmark",
      config: { policies: [] },
    },
  ],
};
