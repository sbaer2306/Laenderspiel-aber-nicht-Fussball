/*  EXPRESS */
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

const port ='8000';
app.listen(port , () => console.log('App listening on port ' + port));


var passport = require('passport');
var userProfile;
 
app.use(passport.initialize());
app.use(passport.session());
 
app.get('/success', (req, res) => {
  res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));
 
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
/*require(dotenv).config()*/
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID ='309647332008-sh1um2m2usfephkeo3hcccn17okpra2q.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET ='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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });