const departmentService = require('../services/department.service');

const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const departmentData = { name };
        const department = await departmentService.createDepartment(departmentData);
        res.status(201).json(department);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Department already exists' });
        }
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
};

const getAllDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getAllDepartments();
        res.status(200).json(departments);
    } catch (error) {
        console.error('Error retrieving departments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const result = await departmentService.deleteDepartment(departmentId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting department:', error);
        const status = error.status || 500;
        const message = error.status ? error.message : 'Internal server error';
        res.status(status).json({ error: message });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    deleteDepartment
};