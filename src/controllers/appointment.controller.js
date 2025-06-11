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

    async cancelAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            const patientId = req.user.id; 

            await appointmentService.cancelAppointment(appointmentId, patientId);

            return res.status(200).json({
                message: 'Appointment canceled'
            });

        } catch (error) {
            if (error.message === 'Appointment not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Not authorized to cancel this appointment') {
                return res.status(403).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async rescheduleAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            const { doctorId, NewSlotId } = req.body;
            const patientId = req.user.id; // Get patient ID from JWT token

            // Validate request body
            if (!doctorId || !NewSlotId) {
                return res.status(400).json({
                    error: 'Missing required fields'
                });
            }

            const appointment = await appointmentService.rescheduleAppointment(
                appointmentId,
                patientId,
                doctorId,
                NewSlotId
            );

            return res.status(200).json({
                message: 'Appointment rescheduled successfully',
                appointmentId: appointment.id
            });

        } catch (error) {
            if (error.message === 'Appointment not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Not authorized to modify this appointment') {
                return res.status(403).json({ error: error.message });
            }
            if (error.message === 'Selected time slot is not available' ||
                error.message === 'Patient already has an appointment at this time' ||
                error.message === 'New time slot must belong to the same doctor') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new AppointmentController();