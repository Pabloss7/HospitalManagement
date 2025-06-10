const appointmentService = require('../services/appointment.service');

class AppointmentController {
    async bookAppointment(req, res) {
        try {
            const { patientId, doctorId, timeSlotId } = req.body;

            // Validate request body
            if (!patientId || !doctorId || !timeSlotId) {
                return res.status(400).json({
                    error: 'Missing required fields'
                });
            }

            const appointment = await appointmentService.bookAppointment(
                patientId,
                doctorId,
                timeSlotId
            );

            return res.status(201).json({
                appointmentId: appointment.id,
                message: 'Appointment booked successfully'
            });

        } catch (error) {
            if (error.message === 'Selected time slot is not available' ||
                error.message === 'Patient already has an appointment at this time') {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Patient not found') {
                return res.status(401).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new AppointmentController();