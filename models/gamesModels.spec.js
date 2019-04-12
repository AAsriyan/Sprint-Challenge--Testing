const db = require("../config/knexConfig.js");
const Games = require("./gamesModels.js");

describe("gamesModels.js", () => {
  beforeEach(async () => {
    await db("games").truncate();
  });

  afterEach(async () => {
    await db("games").truncate();
  });

  describe("getAll()", () => {
    it("should return all games", async () => {
      await Games.insert({
        title: "Mario",
        genre: "Arcade",
        releaseYear: 1998
      });
      await Games.insert({
        title: "Zelda",
        genre: "Puzzle",
        releaseYear: 1999
      });
      await Games.insert({
        title: "Metroid",
        genre: "Shooter",
        releaseYear: 2000
      });
      await Games.insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });
      const games = await Games.getAll();
      expect(games).toHaveLength(4);
    });
  });

  describe("getById()", () => {
    it("return a specific game by the id", async () => {
      await Games.insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      const getHalo = await Games.getById(1);

      const expected = {
        id: 1,
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      };

      expect(getHalo).toEqual(expected);
    });

    it("returns undefined if game by id doesn't exist", async () => {
      const game = await Games.getById(100);
      expect(game).toBeUndefined();
    });
  });

  describe("insert()", () => {
    it("returns the new game", async () => {
      const newGame = {
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      };
      await Games.insert(newGame);
      const getGame = await Games.getById(1);

      expect(getGame).toEqual({
        id: 1,
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });
    });

    it("successfully inserts new game in the database", async () => {
      const newGame = {
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      };

      await Games.insert(newGame);

      const game = await Games.getById(1);

      expect(game).toEqual({
        id: 1,
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });
    });
  });
});
