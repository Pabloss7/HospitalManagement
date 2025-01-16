const specialtyRepository = require('../repositories/specialty.repository');

const getSpecialties = async () => {
    return await specialtyRepository.getSpecialties();
};

const getDepartments = async () => {
    return await specialtyRepository.getDepartments();
};

const createSpecialty = async (name) => {
    return await specialtyRepository.createSpecialty(name);
};

const createDepartment = async (name) => {
    return await specialtyRepository.createDepartment(name);
};

const assignSpecialtyToDoctor = async (doctor_id, specialty_id) => {
    return await specialtyRepository.assignSpecialtyToDoctor(doctor_id, specialty_id);
};

module.exports = {
    getSpecialties,
    getDepartments,
    createSpecialty,
    createDepartment,
    assignSpecialtyToDoctor,
};
