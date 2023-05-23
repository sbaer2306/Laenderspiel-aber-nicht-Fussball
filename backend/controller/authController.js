const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', { failureRedirect: '/signup' });

exports.googleCallbackHandler = (req, res) => {
  // Add logic to handle the callback after successful Google authentication
  // You can redirect the user to a welcome page or perform any other action
  res.redirect('/welcome');
};
