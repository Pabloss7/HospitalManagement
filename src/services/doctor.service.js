const { User, Availability } = require('../models');
const { Op } = require('sequelize');  // Add this import at the top
const { logAction } = require('../utils/logger');
const doctorRepository = require('../repositories/doctor.repository');

class DoctorService {
    async addAvailability(doctorId, availableSlots) {
        const doctor = await doctorRepository.findDoctorById(doctorId);
        if (!doctor) {
            throw new Error('Only doctors can set availability');
        }

        const processedSlots = [];
        for (const slot of availableSlots) {
            // Validate time format and slot conflicts
            const startTime = new Date(`${slot.date} ${slot.startTime}`);
            const endTime = new Date(`${slot.date} ${slot.endTime}`);

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                throw new Error('Invalid date or time format');
            }

            if (startTime >= endTime) {
                throw new Error('Start time must be before end time');
            }

            // Check for conflicts with existing slots
            const conflicts = await Availability.findOne({
                where: {
                    doctorId,
                    Date: slot.date,  // Changed from date to Date
                    [Op.or]: [
                        {
                            startTime: {
                                [Op.between]: [slot.startTime, slot.endTime]
                            }
                        },
                        {
                            endTime: {
                                [Op.between]: [slot.startTime, slot.endTime]
                            }
                        }
                    ]
                }
            });

            if (conflicts) {
                throw new Error(`Time slot conflict found for ${slot.date}`);
            }

            const availability = await doctorRepository.createAvailability({
                doctorId,
                Date: slot.date,  // Changed from date to Date
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: true
            });

            processedSlots.push(availability);
        }
        await logAction('add_availability', doctorId, {
            slots: availableSlots
        });

        return processedSlots;
    }

    async getAvailability(doctorId) {
        return await doctorRepository.findAvailabilityByDoctor(doctorId);
    }

    async updateDoctorAvailability(doctorId, availableSlots) {
        const doctor = await User.findOne({
            where: { id: doctorId, role: 'doctor' }
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        // Get all existing slots for this doctor
        const existingSlots = await Availability.findAll({
            where: {
                doctorId,
                isAvailable: true
            }
        });

        const processedSlots = [];
        for (const newSlot of availableSlots) {
            // Validate time format
            const newStartTime = new Date(`${newSlot.date} ${newSlot.startTime}`);
            const newEndTime = new Date(`${newSlot.date} ${newSlot.endTime}`);

            if (isNaN(newStartTime.getTime()) || isNaN(newEndTime.getTime())) {
                throw new Error('Invalid date or time format');
            }

            if (newStartTime >= newEndTime) {
                throw new Error('Start time must be before end time');
            }

            // Check conflicts with existing slots
            const conflictingSlots = existingSlots.filter(existingSlot => {
                // Only check slots for the same date
                if (existingSlot.Date !== newSlot.date) {
                    return false;
                }

                const existingStart = new Date(`${existingSlot.Date} ${existingSlot.startTime}`);
                const existingEnd = new Date(`${existingSlot.Date} ${existingSlot.endTime}`);

                // Check if slots overlap
                return (existingStart < newEndTime && existingEnd > newStartTime);
            });

            // Delete any conflicting slots
            if (conflictingSlots.length > 0) {
                await Promise.all(conflictingSlots.map(slot => slot.destroy()));
            }

            // Create the new availability slot
            const [availability] = await Availability.upsert({
                doctorId,
                Date: newSlot.date,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                isAvailable: true
            });

            processedSlots.push(availability);
        }

        await logAction('update_availability', doctorId, {
            slots: availableSlots
        });

        return processedSlots;
    }
}

module.exports = new DoctorService();