const { getGoogleOauthToken, getGoogleUser, createUser, checkUserExists } = require('../service/authService');

// Cookie options
const accessTokenCookieOptions = {
  expires: new Date(
    Date.now() + 1 * 60 * 1000
  ),
  maxAge: 1 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions = {
  expires: new Date(
    Date.now() + 59 * 60 * 1000
  ),
  maxAge: 59 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};


exports.googleOauthHandler = async (req, res, next) => {
  try {
    // Get the code from the query
    const code = req.query.code;
    const pathUrl = req.query.state || '/';

    if (!code) {
      return next(new AppError('Authorization code not provided!', 401));
    }
    //TODO huebscher machen
    const r = await getGoogleOauthToken({ code });
    const id_token = r.tokens.id_token;
    const access_token = r.tokens.access_token;
    const refresh_token = r.refresh_token;
    const data = await getGoogleUser({id_token,access_token});
    /*
    if(checkUserExists){
      res.redirect('http://localhost:3000');
    }
    else {
      data.OAuthID = data.id;
      const user_id = await createUser({data})
      res.redirect('http://localhost:3000/createUser');
    }*/
    res.cookie('refresh-token', refresh_token, refreshTokenCookieOptions);
    res.cookie('access-token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      expires: new Date(
        Date.now() + 1 * 60 * 1000
      ),
    });
    res.redirect('http://localhost:3000/game');
  } catch (err) {
    console.log('Failed to authorize Google User', err);
  }
};


