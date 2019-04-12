exports.seed = function(knex) {
  // Deletes ALL existing entries and resets ids
  return knex("games")
    .truncate()
    .then(function() {
      return knex("games").insert([
        { title: "Mario", genre: "Arcade", releaseYear: 1998 },
        { title: "Zelda", genre: "Puzzle", releaseYear: 1999 },
        { title: "Metroid", genre: "Shooter", releaseYear: 2000 },
        { title: "Halo", genre: "Shooter", releaseYear: 2001 }
      ]);
    });
};
