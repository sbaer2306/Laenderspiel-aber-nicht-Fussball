const express = require('express');
const router = express.Router();
const passport = require('passport');

const statsController = require('../controller/statsController');

router.get('/:id/stats',passport.authenticate('jwt', { session: false }), statsController.getUserStats);

module.exports = router;