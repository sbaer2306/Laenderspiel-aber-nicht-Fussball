const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


async function googleLogin(req, res) {
    const token = jwt.sign(req.user, process.env.SECRETKEY, { expiresIn: '12h' });
    res.redirect(`http://localhost:3000/login?token=${token}`)
}

module.exports = {googleLogin}