const { spec } = require('node:test/reporters');
const specialtyService = require('../services/specialty.service');

const getSpecialties = async (req, res) => {
    try{
        const specialties = await specialtyService.getSpecialties();
        res.status(200).json(specialties);
    }catch( error ){
        console.error('Error fetching specialties: ', error.message);
        res.status(400).json({ message: error.message });
    }
};

const getDepartments = async(req, res) => {
    try{
        const departments = await specialtyService.getDepartments();
        res.status(200).json(departments);
    }catch(error){
        console.error('Error fetching departments: ', error.message);
        res.status(400).json({ message: error.message });
    }
};

const createSpecialty = async (req, res) => {
    try{
        const { name } = req.body;
        const specialty = await specialtyService.createSpecialty(name);
        res.status(201).json(specialty);
    }catch(error){
        console.error('Error creating specialty: ', error.message);
        res.status(400).json({ message: error.message });
    }
};

const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const department = await specialtyService.createDepartment(name);
        res.status(201).json(department);
    } catch (error) {
        console.error('Error creating department:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const assignSpecialtyToDoctor = async (req, res) => {
    try {
        const { doctor_id, specialty_id } = req.body;
        const result = await specialtyService.assignSpecialtyToDoctor(doctor_id, specialty_id);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error assigning specialty to doctor:', error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSpecialties,
    getDepartments,
    createSpecialty,
    createDepartment,
    assignSpecialtyToDoctor,
};