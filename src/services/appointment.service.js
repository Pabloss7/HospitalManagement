const { User, Availability } = require('../models');
const appointmentRepository = require('../repositories/appointment.repository');
const { logAction } = require('../utils/logger');

class AppointmentService {
    async bookAppointment(patientId, doctorId, availabilityId) {
        // Verify doctor availability
        const availability = await Availability.findOne({
            where: {
                id: availabilityId,
                doctorId: doctorId,
                isAvailable: true
            }
        });

        if (!availability) {
            throw new Error('Selected time slot is not available');
        }

        // Validate patient exists and is a patient
        const patient = await User.findOne({
            where: { id: patientId, role: 'patient' }
        });

        if (!patient) {
            throw new Error('Patient not found');
        }

        // Check for patient's existing appointments at the same time
        const existingAppointments = await appointmentRepository.findPatientAppointments(patientId);
        const hasConflict = existingAppointments.some(apt => {
            const appointmentDate = new Date(apt.timeSlot.Date);
            const availabilityDate = new Date(availability.Date);
            
            return (
                appointmentDate.getTime() === availabilityDate.getTime() &&
                apt.timeSlot.startTime === availability.startTime
            );
        });

        if (hasConflict) {
            throw new Error('Patient already has an appointment at this time');
        }

        // Create the appointment
        const appointment = await appointmentRepository.createAppointment({
            patientId,
            doctorId,
            availabilityId,
            status: 'confirmed'
        });

        // Update availability status
        await availability.update({ isAvailable: false });

        // Log the action
        await logAction('book_appointment', patientId, {
            doctorId,
            availabilityId,
            appointmentId: appointment.id
        });

        // TODO: Send notifications to patient and doctor

        return appointment;
    }

    async cancelAppointment(appointmentId, patientId) {
        // Find the appointment with all its associations
        const appointment = await appointmentRepository.findAppointmentById(appointmentId);
        
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Verify the patient owns this appointment
        if (appointment.patientId !== patientId) {
            throw new Error('Not authorized to cancel this appointment');
        }

        // Cancel the appointment
        const cancelledAppointment = await appointmentRepository.cancelAppointment(appointmentId);

        // Make the time slot available again
        await appointment.timeSlot.update({ isAvailable: true });

        // Log the action
        await logAction('cancel_appointment', patientId, {
            doctorId: appointment.doctorId,
            appointmentId: appointment.id
        });

        // TODO: Send notifications to patient and doctor
        console.log(`Your appointment from ${patientId} has been cancelled`);
        return cancelledAppointment;
    }

    async rescheduleAppointment(appointmentId, patientId, doctorId, newSlotId) {
        // Find the current appointment
        const currentAppointment = await appointmentRepository.findAppointmentById(appointmentId);
        if (!currentAppointment) {
            throw new Error('Appointment not found');
        }

        // Verify the patient owns this appointment
        if (currentAppointment.patientId !== patientId) {
            throw new Error('Not authorized to modify this appointment');
        }

        // Verify new slot belongs to the same doctor
        const newSlot = await Availability.findOne({
            where: {
                id: newSlotId,
                doctorId: doctorId,
                isAvailable: true
            }
        });

        if (!newSlot) {
            throw new Error('Selected time slot is not available');
        }

        if (newSlot.doctorId !== currentAppointment.doctorId) {
            throw new Error('New time slot must belong to the same doctor');
        }

        // Check for patient's existing appointments at the new time
        const existingAppointments = await appointmentRepository.findPatientAppointments(patientId);
        const hasConflict = existingAppointments.some(apt => {
            const appointmentDate = new Date(apt.timeSlot.Date);
            const newSlotDate = new Date(newSlot.Date);
            
            return (
                apt.id !== appointmentId && // Exclude current appointment
                appointmentDate.getTime() === newSlotDate.getTime() &&
                apt.timeSlot.startTime === newSlot.startTime
            );
        });

        if (hasConflict) {
            throw new Error('Patient already has an appointment at this time');
        }

        // Get the old availability ID before updating the appointment
        const oldAvailabilityId = currentAppointment.availabilityId;

        // Make the old slot available again
        await Availability.update(
            { isAvailable: true },
            { where: { id: oldAvailabilityId } }
        );

        // Update the appointment with new slot
        const updatedAppointment = await appointmentRepository.rescheduleAppointment(appointmentId, newSlotId);

        // Mark new slot as unavailable
        await Availability.update(
            { isAvailable: false },
            { where: { id: newSlotId } }
        );

        // Log the action
        await logAction('reschedule_appointment', patientId, {
            doctorId,
            oldSlotId: currentAppointment.availabilityId,
            newSlotId,
            appointmentId
        });

        // TODO: Send notifications to patient and doctor
        console.log(`Your appointment ,doctor ${doctorId}, with the patient ${patientId} has been reescheduled`);

        return updatedAppointment;
    }

    async getUserAppointments(userId, userRole) {
        let appointments;
        
        if (userRole === 'patient') {
            appointments = await appointmentRepository.findPatientAppointments(userId);
        } else if (userRole === 'doctor') {
            appointments = await appointmentRepository.findDoctorAppointments(userId);
        } else {
            throw new Error('Invalid user role');
        }
        
        // Log the action
        await logAction('view_appointments', userId, {
            role: userRole,
            count: appointments.length
        });

        return appointments;
    }
}

module.exports = new AppointmentService();