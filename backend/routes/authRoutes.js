const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');



const router = express.Router();

// Google OAuth routes
//router.get('/auth/google', authController.googleAuth);
//router.get('/google/callback', authController.googleCallback, authController.googleCallbackHandler);

//module.exports = router;

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
        cookies: req.cookies
      });
    }
  });

  router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    });
  });
  
  router.get("/logout", (req, res) => {
    req.logout();
  });
  
  router.get("/google", authController.googleOauthHandler);
  
  router.get(
    "/google/redirect",
    passport.authenticate("google", {
      failureRedirect: "/auth/login/failed"
    })
  );
  
  module.exports = router;