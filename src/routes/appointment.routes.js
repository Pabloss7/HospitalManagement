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

module.exports = router;