const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Passport to use the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Add logic to handle user authentication and saving to database
      // You can access the user's profile information through the `profile` object
      // Call `done(null, user)` to authenticate the user or `done(null, false)` to reject authentication
    }
  )
);
