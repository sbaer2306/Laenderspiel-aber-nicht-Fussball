const express = require('express');
const controller = require('../controller/playedGamesController')
const playedGamesRouter = express.Router();
const passport = require('passport');

playedGamesRouter.get('/:id/played-games', passport.authenticate('jwt', { session: false }),controller.getPlayedGames);
playedGamesRouter.delete('/:id/played-games', passport.authenticate('jwt', { session: false }),controller.deleteAllPlayedGames);

module.exports = playedGamesRouter;