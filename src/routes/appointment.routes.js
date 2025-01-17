const express = require('express');
const router  = express.Router();
const appointmentController  = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const {notify} = require('../middlewares/notification.middleware');
const {audit } = require('../middlewares/audit.middleware');

router.post(
    '/',
    authenticate(['patient']),
    audit('CREATE', 'appointment'),
    notify('doctor_id', 'A new appointment has been scheduled'),
    appointmentController.createAppointment
);
router.put(
    '/:id',
    authenticate(['patient']),
    audit('UPDATE', 'appointment'),
    notify('doctor_id', 'An appointment has been updated'),
    appointmentController.updateAppointment
    );
router.delete(
    '/:id', 
    authenticate(['patient']),
    audit('DELETE', 'appointment'), 
    notify('doctor_id', 'An appointment has been cancelled'),
    appointmentController.cancelAppointment
    );
router.get(
    '/',
    authenticate(['patient']),
    appointmentController.getMyAppointments
    );

router.get(
    '/doctor',
    authenticate(['doctor']),
    appointmentController.getAppointmentsByDoctor
);
router.post(
    '/availability',
    authenticate(['doctor']),
    audit('CREATE', 'availability'),
    appointmentController.setAvailability
);

module.exports = router;