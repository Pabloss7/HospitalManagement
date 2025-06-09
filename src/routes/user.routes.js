const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/patients', userController.createPatient);
router.post('/doctors', userController.createDoctor);
router.post('/admins', userController.createAdmin);

router.post('/patients/login', userController.loginPatient);
router.post('/doctors/login', userController.loginDoctor);
router.post('/admin/login', userController.loginAdmin);

module.exports = router;