const publicService = require('../services/public.service');

const getPublicDoctors = async (req, res) => {
    try{
        const doctors = await publicService.getPublicDoctors();
        res.status(200).json(doctors);
    }catch(error){
        console.error('Error fetching public doctors:', error.message);
        res.status(400).json({message: error.message});
    }
};

const getPublicDepartments = async (req, res) => {
    try{
        const departments = await publicService.getPublicDepartments();
        res.status(200).json(departments);
    }catch(error){
        console.error('Errror fetching public departments :', error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getPublicDoctors, getPublicDepartments };