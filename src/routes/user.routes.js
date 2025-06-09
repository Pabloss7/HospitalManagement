const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');


router.post('/patients', userController.createPatient);
router.post('/doctors', userController.createDoctor);
router.post('/admins', userController.createAdmin);

router.post('/patients/login', userController.loginPatient);
router.post('/doctors/login', userController.loginDoctor);
router.post('/admin/login', userController.loginAdmin);

router.put('/patients/:patientID',
    verifyToken,
    checkRole(['patient']),
    userController.updateOwnProfile
);
router.put('/doctors/:doctorID', 
    verifyToken,
    checkRole(['doctor']),
    userController.updateOwnProfile
);

module.exports = router;