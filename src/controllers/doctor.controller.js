const doctorService = require('../services/doctor.service');

const addAvailability = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { availableSlots } = req.body;

        if (!Array.isArray(availableSlots)) {
            return res.status(400).json({ message: 'availableSlots must be an array' });
        }

        const availability = await doctorService.addAvailability(doctorId, availableSlots);
        res.status(201).json(availability);
    } catch (error) {
        if (error.message === 'Only doctors can set availability') {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.includes('conflict')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error setting availability', error: error.message });
    }
};

const getAvailability = async (req, res) => {
    try {
        const doctorId = req.params.doctorID;

        const availability = await doctorService.getAvailability(doctorId);
        res.json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability', error: error.message });
    }
};

const updateDoctorAvailability = async (req, res) => {
    try {
        const doctorId = Number(req.params.doctorId);
        const { availableSlots } = req.body;

        if (doctorId !== req.user.id) {
            return res.status(403).json({
                message: 'You can only update your own availability'
            });
        }

        const updatedSlots = await doctorService.updateDoctorAvailability(doctorId, availableSlots);

        res.json({
            message: 'Availability updated successfully',
            slots: updatedSlots
        });
    } catch (error) {
        if (error.message.includes('conflict')) {
            return res.status(409).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'Error updating availability',
            error: error.message
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDoctorsByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const doctors = await doctorService.getDoctorsByDepartment(departmentId);
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error retrieving doctors by department:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addAvailability,
    getAvailability,
    updateDoctorAvailability,
    getAllDoctors,
    getDoctorsByDepartment
};