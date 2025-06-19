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
            // Parse the date and time separately to ensure correct format
            const dateObj = new Date(slot.date);
            if (isNaN(dateObj.getTime())) {
                throw new Error('Invalid date format');
            }

            const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
            const slotStartMinutes = startHours * 60 + startMinutes;

            const endMinutes = (startMinutes + 20) % 60;
            const endHours = startHours + Math.floor((startMinutes + 20) / 60);
            const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;

            const conflicts = await Availability.findAll({
                where: {
                    doctorId,
                    Date: dateObj,
                    [Op.or]: [
                        {
                            // New slot starts during an existing slot
                            [Op.and]: [
                                {
                                    startTime: {
                                        [Op.lte]: `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}:00`
                                    }
                                },
                                {
                                    endTime: {
                                        [Op.gt]: `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}:00`
                                    }
                                }
                            ]
                        },
                        {
                            // New slot ends during an existing slot
                            [Op.and]: [
                                {
                                    startTime: {
                                        [Op.lt]: endTime
                                    }
                                },
                                {
                                    endTime: {
                                        [Op.gte]: endTime
                                    }
                                }
                            ]
                        }
                    ]
                }
            });

            if (conflicts.length > 0) {
                if (slot.isAvailable) {
                    await Promise.all(conflicts.map(conflict => conflict.destroy()));
                } else {
                    throw new Error(`Time slot conflict found for ${slot.date}`);
                }
            }

            const availability = await doctorRepository.createAvailability({
                doctorId,
                Date: dateObj,
                startTime: `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}:00`,
                endTime,
                isAvailable: slot.isAvailable ?? true
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
 // NOTE: I could have separate in a function how I check for conflicts in order to reduce num of lines
 // , but I run out of time
    async updateDoctorAvailability(doctorId, availableSlots) {
        const doctor = await User.findOne({
            where: { id: doctorId, role: 'doctor' }
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const processedSlots = [];
        for (const slot of availableSlots) {
            const dateObj = new Date(slot.date);
            if (isNaN(dateObj.getTime())) {
                throw new Error('Invalid date format');
            }

            const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
            const slotStartMinutes = startHours * 60 + startMinutes;

            const conflicts = await Availability.findAll({
                where: {
                    doctorId,
                    Date: dateObj,
                    isAvailable: true,
                    startTime: {
                        [Op.and]: [
                            { [Op.gte]: `${Math.floor((slotStartMinutes - 20) / 60).toString().padStart(2, '0')}:${((slotStartMinutes - 20) % 60).toString().padStart(2, '0')}:00` },
                            { [Op.lte]: `${Math.floor((slotStartMinutes + 20) / 60).toString().padStart(2, '0')}:${((slotStartMinutes + 20) % 60).toString().padStart(2, '0')}:00` }
                        ]
                    }
                }
            });

            if (conflicts.length > 0) {
                await Promise.all(conflicts.map(conflict => conflict.destroy()));
            }

            const endMinutes = (startMinutes + 20) % 60;
            const endHours = startHours + Math.floor((startMinutes + 20) / 60);
            const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;

            const [availability] = await Availability.upsert({
                doctorId,
                Date: dateObj,
                startTime: slot.startTime,
                endTime: endTime,
                isAvailable: true
            });

            processedSlots.push(availability);
        }

        await logAction('update_availability', doctorId, {
            slots: availableSlots
        });

        return processedSlots;
    }

    async getAllDoctors() {
        const doctors = await doctorRepository.getAllDoctors();
        
        return doctors.map(doctor => ({
            doctorID: doctor.id,
            name: doctor.name,
            departmentName: doctor.Departments[0]?.name || '',
            availability: doctor.availabilities.map(slot => ({
                day: new Date(slot.Date).toLocaleDateString('es-ES', { weekday: 'long' }),
                startDate: slot.startTime,
                endDate: slot.endTime
            }))
        }));
    }

    async getDoctorsByDepartment(departmentId) {
        try {
            const doctors = await doctorRepository.getDoctorsByDepartment(departmentId);
            return doctors;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DoctorService();