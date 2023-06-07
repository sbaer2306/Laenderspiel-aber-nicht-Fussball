const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');

router.get('/:id', profileController.getProfile);
router.put('/:id', profileController.updateProfile);
router.post('/', profileController.createProfile);

module.exports = router;