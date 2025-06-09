const appointmentRepository = require('../repositories/appointment.repository');

const createAppointment = async ({ patient_id, doctor_id, date, time }) => {
    return await appointmentRepository.createAppointment({ patient_id, doctor_id, date, time });
};

const updateAppointment = async (id, { date, time }) => {
    return await appointmentRepository.updateAppointment(id, { date, time });
};

const cancelAppointment = async (id) => {
    return await appointmentRepository.cancelAppointment(id);
};

const getAppointmentsByPatient = async (patient_id) => {
    return await appointmentRepository.getAppointmentsByPatient(patient_id);
};

const getAppointmentsByDoctor = async (doctor_id) => {
    return await appointmentRepository.getAppointmentsByDoctor(doctor_id);
};

const setAvailability = async (doctor_id, date, time_slots) => {
    return await appointmentRepository.setAvailability(doctor_id, date, time_slots);
};

module.exports = {
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    setAvailability,
};
