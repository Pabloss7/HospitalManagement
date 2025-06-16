const { Department, User } = require('../models');
const userRepository = require('../repositories/user.repository');
const departmentRepository = require('../repositories/department.repository');

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

    async getAllDepartments() {
        try {
            const departments = await departmentRepository.getAllDepartments();
            return {
                departments: departments.map(dept => ({
                    departmentId: dept.id,
                    name: dept.name
                }))
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteDepartment(departmentId) {
        try {
            // Check if department exists
            const department = await departmentRepository.getDepartmentById(departmentId);
            if (!department) {
                throw { status: 404, message: 'Department not found' };
            }

            // Check if there are doctors in the department
            const doctors = await departmentRepository.getDepartmentDoctors(departmentId);
            if (doctors.length > 0) {
                throw { status: 400, message: 'Cannot delete department with assigned doctors' };
            }

            // Delete the department
            await departmentRepository.deleteDepartment(departmentId);
            return { message: 'Department deleted' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DepartmentService();