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

    it("should return status 500", async () => {
      await db("games").insert({
        title: "Halo",
        genre: "Shooter",
        releaseYear: 2001
      });

      let res = await request(server).get("/api/game");

      expect(res.status).toBe(404);
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
});
