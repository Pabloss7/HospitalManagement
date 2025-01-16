const express = require('express');
const router  = express.Router();
const appointmentController  = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate(['patient']), appointmentController.createAppointment);
router.put('/:id', authenticate(['patient']), appointmentController.updateAppointment);
router.delete('/:id', authenticate(['patient']), appointmentController.cancelAppointment);
router.get('/', authenticate(['patient']), appointmentController.getMyAppointments);

router.get('/doctor', authenticate(['doctor']), appointmentController.getAppointmentsByDoctor);
router.post('/availability', authenticate(['doctor']), appointmentController.setAvailability);

module.exports = router;