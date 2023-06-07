const express = require('express');
const controller = require('../controller/userController')
const userRoutes = express.Router();

userRoutes.delete('/:id', controller.deleteUser);
userRoutes.get('/:id/profile', controller.getProfileByUserId);

module.exports = userRoutes;