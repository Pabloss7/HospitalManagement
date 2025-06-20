const userService = require('../services/user.service');
const departmentService = require('../services/department.service');


const createPatient = async (req, res) => {
    try {
        const { name, email, password, age, gender, address, phone } = req.body;
        const userData = { 
            name, 
            email, 
            password, 
            age,
            gender,
            address,
            phone,
            role: 'patient' 
        };
        
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
        const { name, email, password, departmentId, age, gender, address, phone } = req.body;
        
        // Validate department exists
        const department = await departmentService.getDepartmentById(departmentId);
        if (!departmentId || !department) {
            return res.status(400).json({ message: 'Invalid department ID' });
        }

        const userData = { 
            name, 
            email, 
            password, 
            age,
            gender,
            address,
            phone,
            role: 'doctor'
        };
        const user = await userService.createUser(userData);
        await departmentService.assignDoctorToDepartment(user.id, departmentId);
     
        
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, age, gender, address, phone } = req.body;
        const userData = { 
            name, 
            email, 
            password, 
            age,
            gender,
            address,
            phone,
            role: 'admin' 
        };

        const user = await userService.createUser(userData);
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
const updateOwnProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, address } = req.body;
        
        const updateData = { name, email, phone, address };
        
        const user = await userService.updateUser(userId, updateData);
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password, 'patient');
        
        res.status(200).json({
            patientID: result.id,
            token: result.token,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid credentials'
        });
    }
};

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password, 'doctor');
        
        res.status(200).json({
            doctorID: result.id,
            token: result.token,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid credentials'
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password, 'admin');
        
        res.status(200).json({
            adminID: result.id,
            token: result.token,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid credentials'
        });
    }
};

module.exports = {
    createPatient,
    createDoctor,
    createAdmin,
    updateOwnProfile,
    loginPatient,
    loginDoctor,
    loginAdmin
};