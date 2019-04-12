const request = require("supertest");
const db = require("../config/knexConfig.js");
const server = require("./server.js");

describe("server.js", () => {
  beforeEach(async () => {
    await db("games").truncate();
  });

  describe("GET /", () => {
    it("should respond with 200 OK", async () => {
      const res = await request(server).get("/");

      expect(res.status).toBe(200);
    });

    it("should return JSON", async () => {
      const res = await request(server).get("/");

      expect(res.type).toBe("application/json");
    });

    it("should check for json", () => {
      return request(server)
        .get("/")
        .expect(/server is hot/i);
    });
  });

  describe("GET /api/games", () => {
    it("should return an empty array", async () => {
      let res = await request(server).get("/api/games");
      expect(res.body).toEqual([]);
      expect(res.body).toHaveLength(0);
    });

    it("should return all the games", async () => {
      let res = await request(server).get("/api/games");
      expect(res.body).toHaveLength(0);

      await db("games").insert({
        title: "Mario",
        genre: "Arcade",
        releaseYear: 1998
      });
      await db("games").insert({
        title: "Zelda",
        genre: "Puzzle",
        releaseYear: 1999
      });
      await db("games").insert({
        title: "Metroid",
        genre: "Shooter",
        releaseYear: 2000
      });
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      res = await request(server).get("/api/games");
      expect(res.body).toHaveLength(4);
    });

    it("should return status 200", async () => {
      let res = await request(server).get("/api/games");
      expect(res.status).toBe(200);
    });

    it("should return status 404", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      let res = await request(server).get("/api/game");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/games/:id", () => {
    it("should return a status of 200 OK", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      let res = await request(server).get("/api/games/1");
      expect(res.status).toBe(200);
    });

    it("should return a status of 404 Not Found", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      let res = await request(server).get("/api/games/2");
      expect(res.status).toBe(404);
    });

    it("should return a status the game object where id === 2", async () => {
      await db("games").insert({
        title: "Mario",
        genre: "Arcade",
        releaseYear: 1998
      });
      await db("games").insert({
        title: "Zelda",
        genre: "Puzzle",
        releaseYear: 1999
      });
      await db("games").insert({
        title: "Metroid",
        genre: "Shooter",
        releaseYear: 2000
      });

      let res = await request(server).get("/api/games/2");
      expect(res.body).toEqual({
        id: 2,
        title: "Zelda",
        genre: "Puzzle",
        releaseYear: 1999
      });
    });
  });

  describe("POST /api/games", () => {
    it("should return the inserted game", async () => {
      const halo = {
        id: 1,
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      };

      let res = await request(server)
        .post("/api/games")
        .send(halo);
      expect(res.body).toEqual(halo);
    });

    it("should return a 201 status", async () => {
      const halo = {
        id: 1,
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      };

      let res = await request(server)
        .post("/api/games")
        .send(halo);
      expect(res.status).toEqual(201);
    });

    it("should return a 422 status if bad form", async () => {
      const halo = {
        id: 1,
        faketitle: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      };

      let res = await request(server)
        .post("/api/games")
        .send(halo);
      expect(res.status).toEqual(422);
    });
  });

  describe("DELETE api/games/:id", () => {
    it("should return a 204 status if game is deleted successfully", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      let res = await request(server).del("/api/games/1");

      expect(res.status).toBe(204);

      res = await request(server).get("/api/games");
      expect(res.body).toEqual([]);
      expect(res.body).toHaveLength(0);
    });

    it("should return a 404 status if game is not found by id", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      let res = await request(server).del("/api/games/2");

      expect(res.status).toBe(404);
    });

    it("should return 1 length less after deletion", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      await db("games").insert({
        title: "Zelda",
        genre: "Puzzle",
        releaseYear: 1999
      });

      let initialRes = await request(server).get("/api/games");

      expect(initialRes.body).toHaveLength(2);

      await request(server).del("/api/games/2");

      let res = await request(server).get("/api/games");

      expect(res.body).toHaveLength(1);
    });
  });

  describe("PUT api/games/:id", () => {
    it("should return a 200 status after updating a game", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      const gameUpdated = {
        title: "Halo 2",
        genre: "Shooter",
        releaseYear: 2001
      };

      let res = await request(server)
        .put("/api/games/1")
        .send(gameUpdated);

      expect(res.status).toBe(200);
    });

    it("should return a 400 status if title does not exist", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      const gameUpdated = {
        titl: "Halo 2",
        genre: "Shooter",
        releaseYear: 2001
      };

      let res = await request(server)
        .put("/api/games/1")
        .send(gameUpdated);

      expect(res.status).toBe(400);
    });

    it("should return a 404 status if game does not exist by stated id", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      const gameUpdated = {
        title: "Halo 2",
        genre: "Shooter",
        releaseYear: 2001
      };

      let res = await request(server)
        .put("/api/games/10")
        .send(gameUpdated);

      expect(res.status).toBe(404);
    });
  });
});
