const { User, Appointment, Availability } = require('../models');

class AppointmentRepository {
    async createAppointment(appointmentData) {
        return await Appointment.create(appointmentData);
    }

    async findAppointmentById(id) {
        return await Appointment.findByPk(id, {
            include: [
                { 
                    model: User, 
                    as: 'patient',
                    attributes: ['name']
                },
                { 
                    model: User, 
                    as: 'doctor',
                    attributes: ['name']
                },
                { model: Availability, as: 'timeSlot' }
            ]
        });
    }

    async findPatientAppointments(patientId) {
        return await Appointment.findAll({
            where: { patientId },
            include: [
                { 
                    model: User, 
                    as: 'doctor',
                    attributes: ['name']
                },
                { model: Availability, as: 'timeSlot' }
            ]
        });
    }

    async findDoctorAppointments(doctorId) {
        return await Appointment.findAll({
            where: { doctorId },
            include: [
                { 
                    model: User, 
                    as: 'patient',
                    attributes: ['name']
                },
                { model: Availability, as: 'timeSlot' }
            ]
        });
    }

    async cancelAppointment(appointmentId) {
        const appointment = await this.findAppointmentById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        
        await appointment.update({ status: 'cancelled' });
        return appointment;
    }

    async rescheduleAppointment(appointmentId, newAvailabilityId) {
        const appointment = await this.findAppointmentById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        
        await appointment.update({ availabilityId: newAvailabilityId });
        return appointment;
    }
}

module.exports = new AppointmentRepository();