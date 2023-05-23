/*  old
const express = require('express');
const app = express();
const session = require('express-session');
//gameRoutes
const gameRoutes = require('./routes/gameRoutes');

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
//connects endpoint to routes /game/...
app.use('/game', gameRoutes)
 
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
/*require(dotenv).config()
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID ='test';
const GOOGLE_CLIENT_SECRET ='test';

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
  });*/
const express = require('express');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Initialize Passport middleware
app.use(passport.initialize());

// Include the auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
