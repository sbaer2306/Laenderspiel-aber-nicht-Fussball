const express = require('express');
const router = express.Router();

const statsController = require('../controller/statsController');

router.get('/:id/stats', statsController.getUserStats);

module.exports = router;