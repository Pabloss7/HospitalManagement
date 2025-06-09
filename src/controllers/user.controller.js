const userService = require('../services/user.service');
const departmentService = require('../services/department.service');


const createPatient = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userData = { name, email, password, role: 'patient' };
        
        const user = await userService.createUser(userData);
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};
const createDoctor = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
        const departmentDB = await departmentService.getDepartmentByName(department); 
        if(!department || !departmentDB){
            return res.status(400).json({ message: 'Invalid department' });
        }
        const userData = { name, email, password, role: 'doctor', department };

        const user = await userService.createUser(userData);
        await departmentService.assignDoctorToDepartment(user.id, departmentDB.id);
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
module.exports = {
    createPatient,
    createDoctor
};