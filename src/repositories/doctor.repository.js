const { User, Availability, Department , DoctorDepartment } = require('../models');


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
            order: [['Date', 'ASC'], ['startTime', 'ASC']]
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

    async getAllDoctors() {
        return await User.findAll({
            where: { role: 'doctor' },
            include: [
                {
                    model: Department,
                    through: DoctorDepartment
                },
                {
                    model: Availability,
                    as: 'availabilities', 
                    where: { isAvailable: true },
                    required: false
                }
            ],
            distinct: true
        });
    }

    async getDoctorsByDepartment(departmentId) {
        try {
            const doctors = await User.findAll({
                include: [{
                    model: Department,
                    through: DoctorDepartment,
                    where: { id: departmentId }
                }],
                where: { role: 'doctor' },
                attributes: ['id', 'name', 'email', 'phone', 'address']
            });
            return doctors;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DoctorRepository();