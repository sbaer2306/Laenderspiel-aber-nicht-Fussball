const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
const passport = require('passport');

router.get('/:id',profileController.getProfile);
router.put('/:id', passport.authenticate('jwt', { session: false }),profileController.updateProfile);
router.post('/', passport.authenticate('jwt', { session: false }),profileController.createProfile);

module.exports = router;