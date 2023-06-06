const express = require('express');
const controller = require('../controller/userController')
const userRoutes = express.Router();

userRoutes.delete('/:id', controller.deleteUser);

module.exports = userRoutes;