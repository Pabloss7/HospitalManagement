const { User, Department } = require('../models');

const modifyDoctorInfo = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { name, age, gender, address, departmentId } = req.body;
        
        // Find doctor with their current department
        const doctor = await User.findOne({
            where: {
                id: doctorId,
                role: 'doctor'
            },
            include: [Department]
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Prepare user data update
        const doctorData = { name, age, gender, address };
        for (const key in doctorData) {
            if (doctorData[key] === undefined) {
                delete doctorData[key];
            }
        }

        if (Object.keys(doctorData).length === 0 && !departmentId) {
            return res.status(400).json({ message: 'No data provided for modification' });
        }

        await doctor.update(doctorData);

        if (departmentId) {
            const newDepartment = await Department.findByPk(departmentId);
            if (!newDepartment) {
                return res.status(404).json({ message: 'Department not found' });
            }
            await doctor.setDepartments([newDepartment]);
        }

        const finalDoctor = await User.findOne({
            where: { id: doctorId },
            include: [Department]
        });

        res.status(200).json(finalDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Error modifying doctor information', error: error.message });
    }
}

const modifyPatientInfo = async (req, res) => {
    try {
        const { patientID } = req.params;
        const { name, age, gender, address } = req.body;
        const patient = await User.findByPk(patientID);
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patientData = { name, age, gender, address };
        for (const key in patientData) {
            if (patientData[key] === undefined) {
                delete patientData[key];
            }
        }

        if (Object.keys(patientData).length === 0) {
            return res.status(400).json({ message: 'No data provided for modification' });
        }

        const updatedPatient = await patient.update(patientData);
        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error modifying patient information', error: error.message });
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await User.findAll({
            where: { role: 'patient' },
            attributes: ['name', 'email', 'phone', 'address']
        });
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error retrieving patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    modifyPatientInfo,
    modifyDoctorInfo,
    getAllPatients  // Add this to exports
};