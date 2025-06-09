const { Department } = require('../models');
class DepartmentRepository {
    async createDepartment(departmentData) {
        try {
            const department = await Department.create(departmentData);
            return department;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new DepartmentRepository();