const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });


const router = express.Router();
  
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.googleLogin);
  
  
module.exports = router;