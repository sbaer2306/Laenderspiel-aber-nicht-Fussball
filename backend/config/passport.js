const GoogleStrategy = require('passport-google-oauth20').Strategy
const { getUserByOAuthID, createUser, getUserById } = require('../service/userService');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          email: profile.emails[0].value,
          OAuthID: profile.id,
          username: profile.emails[0].value.split("@")[0],
        }
        try {
          const OAuthID = profile.id;
          let user = await getUserByOAuthID(OAuthID)

          if (user) {
            done(null, user)
          } else {
            user = await createUser(newUser)
            done(null, user)
          }
          console.log("Done");
        } catch (err) {
          console.error(err)
        }
      }
    )
  )
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
        secretOrKey: process.env.SECRETKEY,
      },
      async (jwtPayload, done) => {
        try {
          const user = await getUserById(jwtPayload.id);
          done(null, user); 
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    getUserById(id, (err, user) => done(err, user))
  })
}