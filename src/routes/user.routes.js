const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/patients', userController.createPatient);
router.post('/doctors', userController.createDoctor);

module.exports = router;