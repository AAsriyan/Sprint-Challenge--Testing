const db = require("../config/knexConfig.js");

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById
};

function getAll() {
  return db("games");
}

function getById(id) {
  return db("games")
    .where({ id })
    .first();
}

function insert(game) {
  return db("games").insert(game);
}

async function update(id, updated) {
  return db("games")
    .where({ id })
    .update(updated);
}

function remove(id) {
  return db("games")
    .where({ id })
    .del();
}
