const express = require('express');
const controller = require('../controller/userController')
const userRoutes = express.Router();
const passport = require('passport');

userRoutes.delete('/:id', passport.authenticate('jwt', { session: false }),controller.deleteUser);
userRoutes.get('/:id/profile',passport.authenticate('jwt', { session: false }), controller.getProfileByUserId);
userRoutes.get('/userinfo', passport.authenticate('jwt', { session: false }), function(req, res){
    res.json({user: req.user});
});
userRoutes.put('/:id/username', passport.authenticate('jwt', { session: false }), controller.changeUsername);

module.exports = userRoutes;