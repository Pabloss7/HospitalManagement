const { Department, User } = require('../models');
const userRepository = require('../repositories/user.repository');

class DepartmentService {
    async createDepartment(departmentData) {
        try {
            const department = await Department.create(departmentData);
            return department;
        } catch (error) {
            throw error;
        }
    }
    async getDepartmentByName(departmentName) {
        try {
            const department = await Department.findOne({
                where: {
                    name: departmentName
                }
            });
            return department;
        } catch (error) {
            throw error;
        }
    }
    async assignDoctorToDepartment(userId, departmentId) {
        try {
            const user = await userRepository.getUserById(userId);
            const department = await Department.findByPk(departmentId);
            if (!department) {
                throw new Error('Department not found');
            }

            await user.addDepartment(department);
            return { message: 'Doctor assigned to department successfully' };
        } catch (error) {
            console.error('Error in assignDoctorToDepartment:', error);
            throw error;
        }
    }
}

module.exports = new DepartmentService();