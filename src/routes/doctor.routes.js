const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

// Add availability slots
router.post('/availability',
    verifyToken,
    checkRole(['doctor']),
    doctorController.addAvailability
);


router.get('/doctors/:doctorID/availability',
    verifyToken,
    checkRole(['doctor', 'patient']),
    doctorController.getAvailability
);

// Update doctor availability
router.put('/doctors/:doctorId/availability',
    verifyToken,
    checkRole(['doctor']),
    doctorController.updateDoctorAvailability
);


module.exports = router;