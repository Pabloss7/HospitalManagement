const departmentService = require('../services/department.service');
const createDepartment = async (req, res) => {
    try {
        const { name} = req.body;
        const departmentData = { name };
        const department = await departmentService.createDepartment(departmentData);
        res.status(201).json(department);
    }catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Department already exists' });
        }
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
}
module.exports = {
    createDepartment
}