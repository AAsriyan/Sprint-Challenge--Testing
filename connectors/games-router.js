const router = require("express").Router();
const Games = require("../models/gamesModels.js");

router.get("/", async (req, res) => {
  try {
    const games = await Games.getAll();

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Games.getById(id);

    if (game) {
      res.status(200).json(game);
    } else {
      res.status(404).json({ message: "Game not found." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  const { title, genre } = req.body;

  if (!title || !genre) {
    return res.status(422).json({
      message: "Please provide a title and genre for this game."
    });
  }

  try {
    const [id] = await Games.insert(req.body);
    const game = await Games.getById(id);

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const count = await Games.remove(id);

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "The game could not be found." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, genre } = req.body;
  const updated = req.body;

  if (!title || !genre) {
    return res.status(400).json({
      message: "Please provide a title and genre for this game."
    });
  }

  try {
    const count = await Games.update(id, updated);

    if (count > 0) {
      const game = await Games.getById(id);
      res.status(200).json(game);
    } else {
      res.status(404).json({ message: "Game not found." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
