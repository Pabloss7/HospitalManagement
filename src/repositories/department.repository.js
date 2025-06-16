const { Department, User, DoctorDepartment } = require('../models');
class DepartmentRepository {
    async createDepartment(departmentData) {
        try {
            const department = await Department.create(departmentData);
            return department;
        } catch (error) {
            throw error;
        }
    }

    async getAllDepartments() {
        try {
            const departments = await Department.findAll({
                attributes: ['id', 'name']
            });
            return departments;
        } catch (error) {
            throw error;
        }
    }

    async getDepartmentById(id) {
        try {
            const department = await Department.findByPk(id);
            return department;
        } catch (error) {
            throw error;
        }
    }

    async getDepartmentDoctors(departmentId) {
        try {
            const doctors = await DoctorDepartment.findAll({
                where: { departmentId }
            });
            return doctors;
        } catch (error) {
            throw error;
        }
    }

    async deleteDepartment(id) {
        try {
            const result = await Department.destroy({
                where: { id }
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DepartmentRepository();