const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.post('/', 
    verifyToken,
    checkRole(['patient']),
    appointmentController.bookAppointment
);

router.delete('/:appointmentId',
    verifyToken,
    checkRole(['patient']),
    appointmentController.cancelAppointment
);

router.put('/:appointmentId',
    verifyToken,
    checkRole(['patient']),
    appointmentController.rescheduleAppointment
);

router.get('/own-appointments',
    verifyToken,
    checkRole(['patient', 'doctor']),
    appointmentController.getMyAppointments
);

module.exports = router;