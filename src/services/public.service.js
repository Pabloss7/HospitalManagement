const publicRepository = require('../repositories/public.repository');

const getPublicDoctors = async () => {
    return await publicRepository.getPublicDoctors();
};

const getPublicDepartments = async () => {
    return await publicRepository.getPublicDepartments();
};

module.exports = { getPublicDoctors, getPublicDepartments};