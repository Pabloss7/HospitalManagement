const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');


router.post('/availability',
    verifyToken,
    checkRole(['doctor']),
    doctorController.addAvailability
);

router.get('/:doctorID/availability',
    verifyToken,
    checkRole(['doctor', 'patient']),
    doctorController.getAvailability
);

router.put('/:doctorId/availability',
    verifyToken,
    checkRole(['doctor']),
    doctorController.updateDoctorAvailability
);

router.get('/',
    doctorController.getAllDoctors
);

router.get('/department/:departmentId',
    doctorController.getDoctorsByDepartment
);

module.exports = router;