const players = require('../griddy/server/players.json');

module.exports = (req, res) => {
  res.json({ message: players });
};
