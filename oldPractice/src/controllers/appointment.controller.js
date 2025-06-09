const { error } = require('console');
const appointmentService = require('../services/appointment.service');
const app = require('../app');

const createAppointment = async (req, res) => {
    try{
        const { doctor_id, date, time } = req.body;
        const patient_id = req.user.id;

        const appointment = await appointmentService.createAppointment({
            patient_id,
            doctor_id,
            date,
            time
        });
        res.status(201).json(appointment);
    }catch(error){
        console.error("Error creating appointment: ", error.message);
        res.status(400).json({ message: error.message });
    }
};

const updateAppointment = async (req, res) => {
    try{
        const { id } = req.params;
        const { date, time } = req.body;

        const appointment = await appointmentService.updateAppointment(id, { date, time});
        res.status(200).json(appointment);
    }catch(error){
        console.log("Error updating appointment:", error.message);
        res.status(400).json({ message: error.message});
    }
};

const cancelAppointment = async (req, res) => {
    try{
        const { id } = req.params;

        const result = await appointmentService.cancelAppointment(id);
        res.status(200).json({ message: "Appointment cancelled:", result});
    }catch(error){
        console.log("Error cancelling appointment:", error.message);
        res.status(400).json({ message: error.message});
    }
};

const getMyAppointments = async ( req, res) =>{
    try{
        const patien_id = req.user.id;

        const appointments = await appointmentService.getAppointmentsByPatient(patien_id);
        res.status(200).json(appointments);
    }catch( error ){
        console.log("Error fetching appointments or 0 appointments:", error.message);
        res.status(400).json({ message: error.message });
    }
};

const getAppointmentsByDoctor = async (req, res) => {
    try{
        const doctor_id = req.user.id;

        const appointments = await appointmentService.getAppointmentsByDoctor(doctor_id);
        res.status(200).json(appointments);
    }catch(error){
        console.log("Error fetching or not appointments:", error.message);
        res.status(400).json({ message: error.message });
    }
};

const setAvailability = async (req, res) => {
    try{
        const doctor_id = req.user.id;
        const {date , time_slots} =req.body;

        const availability = appointmentService.setAvailability(doctor_id, date, time_slots);
        res.status(201).json(availability);
    }catch(error){
        console.log("Error setting availability: ", error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getMyAppointments,
    getAppointmentsByDoctor,
    setAvailability,
};