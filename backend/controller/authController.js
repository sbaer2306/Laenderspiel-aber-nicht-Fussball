const { getGoogleOauthToken, getGoogleUser } = require('../service/authService');

exports.googleOauthHandler = async (req, res, next) => {
  try {
    // Get the code from the query
    const code = req.query.code;
    const pathUrl = req.query.state || '/';

    if (!code) {
      return next(new AppError('Authorization code not provided!', 401));
    }

    const r = await getGoogleOauthToken({ code });
    const id_token = r.tokens.id_token;
    const access_token = r.tokens.access_token;
    const data = await getGoogleUser({id_token,access_token});

    const email = data.email;

    const data2 = JSON.stringify(data, null, 2)
    // Send the email in the response
    res.send(`Hello, this is the example route! Your Google email is ${email}`);
  } catch (err) {
    console.log('Failed to authorize Google User', err);
  }
};


