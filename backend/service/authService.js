const axios = require('axios');
const qs = require('qs');
const { OAuth2Client } = require("google-auth-library");
const {google} = require("googleapis");
const passport = require('passport');
const keys = require('../oauth2.keys.json');
require('dotenv').config();

const getGoogleOauthToken = async ({ code }) => {
  const oAuth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
  });
  const r = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(r.tokens);
  return r;
};

const getGoogleUser = async ({ id_token, access_token }) =>{
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return data;
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
}

module.exports = { getGoogleOauthToken,  getGoogleUser };

