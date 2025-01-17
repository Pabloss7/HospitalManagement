const express = require('express');
const router  = express.Router();
const appointmentController  = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate(['patient']), audit('CREATE', 'appointment'), appointmentController.createAppointment);
router.put('/:id', authenticate(['patient']), audit('UPDATE', 'appointment'),appointmentController.updateAppointment);
router.delete('/:id', authenticate(['patient']), audit('DELETE', 'appointment'), appointmentController.cancelAppointment);
router.get('/', authenticate(['patient']), appointmentController.getMyAppointments);

router.get('/doctor', authenticate(['doctor']), appointmentController.getAppointmentsByDoctor);
router.post('/availability', authenticate(['doctor']), audit('CREATE', 'availability'), appointmentController.setAvailability);

module.exports = router;