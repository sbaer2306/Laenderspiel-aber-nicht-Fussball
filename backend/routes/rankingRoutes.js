const express = require('express');
const rankingController = require('../controller/rankingController');
const rankingRouter = express.Router();

rankingRouter.get('/all-time', rankingController.getAllTimeRanking);
rankingRouter.get('/monthly/:year/:month', rankingController.getMonthlyRanking);

module.exports = rankingRouter;
