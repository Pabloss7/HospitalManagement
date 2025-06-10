const { User, Appointment, Availability } = require('../models');

class AppointmentRepository {
    async createAppointment(appointmentData) {
        return await Appointment.create(appointmentData);
    }

    async findAppointmentById(id) {
        return await Appointment.findByPk(id, {
            include: [
                { model: User, as: 'patient' },
                { model: User, as: 'doctor' },
                { model: Availability, as: 'timeSlot' }
            ]
        });
    }

    async findPatientAppointments(patientId) {
        return await Appointment.findAll({
            where: { patientId },
            include: [
                { model: User, as: 'doctor' },
                { model: Availability, as: 'timeSlot' }
            ]
        });
    }

    async findDoctorAppointments(doctorId) {
        return await Appointment.findAll({
            where: { doctorId },
            include: [
                { model: User, as: 'patient' },
                { model: Availability, as: 'timeSlot' }
            ]
        });
    }
}

module.exports = new AppointmentRepository();