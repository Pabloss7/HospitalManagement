const { User, Availability } = require('../models');

class DoctorRepository {
    async findDoctorById(doctorId) {
        return await User.findOne({
            where: { id: doctorId, role: 'doctor' }
        });
    }

    async createAvailability(availabilityData) {
        return await Availability.create(availabilityData);
    }

    async findAvailabilityByDoctor(doctorId) {
        return await Availability.findAll({
            where: { doctorId },
            order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
        });
    }

    async findAvailabilityById(availabilityId, doctorId) {
        return await Availability.findOne({
            where: { id: availabilityId, doctorId }
        });
    }

    async updateAvailability(availability, updateData) {
        return await availability.update(updateData);
    }
}

module.exports = new DoctorRepository();