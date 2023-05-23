const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');

const router = express.Router();

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback, authController.googleCallbackHandler);

module.exports = router;
