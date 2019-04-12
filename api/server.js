const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const gamesRouter = require("../connectors/games-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/games", gamesRouter);

server.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is HOT" });
});

module.exports = server;
