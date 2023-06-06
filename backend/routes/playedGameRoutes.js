const express = require('express');
const controller = require('../controller/playedGamesController')
const playedGamesRouter = express.Router();

playedGamesRouter.get('/:id/played-games', controller.getPlayedGames);
playedGamesRouter.delete('/:id/played-games', controller.deleteAllPlayedGames);

module.exports = playedGamesRouter;