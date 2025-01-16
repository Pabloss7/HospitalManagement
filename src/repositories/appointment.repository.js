const { resolve } = require('path');
const db = require('../config/db');
const { reject } = require('bcrypt/promises');

const createAppointment = ({ patient_id, doctor_id, date, time }) => {
    return new Promise((resolve, reject) =>{
        const query = `
        INSERT INTO appointments (patient_id, doctor_id, date, time, status)
        VALUES (?, ?, ?, ?, 'pending')
        `;
    
        db.run(
            query,
            [
                patient_id,
                doctor_id,
                date,
                time
            ],
            function (err) {
                if(err){
                    console.log("Database error:", err.message);
                    reject(err.message);
                }else{
                    resolve({ id: this.lastID, patient_id, doctor_id, date, time, status: 'pending'});
                }
            }
        );
    });
};

const updateAppointment = (id, { date, time}) => {
    return new Promise((resolve, reject) =>{
        const query = `
        UPDATE appointments
        SET date = ?, time = ?
        WHERE id = ?
        `;
        db.run(query, [date, time, id], function (err) {
            if(err){
                console.log("Error updating appointment");
                reject(err.message);
            }else{
                resolve({ changes: this.changes });
            }
        });
    });
};

const cancelAppointment = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE appointments
        SRT status = 'cancelled'
        WHERE id = ?
        `;

        db.run(query, [ id ], function (err) {
            if(err){
                console.log("Error cancelling appointment");
                reject(err.message);
            }else{
                resolve({ changes: this.changes });
            }
        });
    });
};

const getAppointmentsByPatient = (patient_id) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * FROM appointments
        WHERE patient_id = ?
        `;

        db.all( query, [patient_id], (err, rows) => {
            if(err){
                console.log("Error fetching appointments for this patient:", patient_id,err.message);
                reject(err.message);
            }else{
                resolve(rows);
            }
        });
    });
};

const getAppointmentsByDoctor = (doctor_id) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * FROM appointments
        WHERE doctor_id = ?
        `;

        db.all( query, [doctor_id], (err, rows) => {
            if(err){
                console.log("Error fetching appointments for this patient:", patient_id,err.message);
                reject(err.message);
            }else{
                resolve(rows);
            }
        });
    });
};

const setAvailability = (doctor_id, date, time_slots) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO availability (doctor_id, date, time_slots)
        VALUES (?, ?, ?)
        `;

        db.run(
            query,
            [
                doctor_id,
                date,
                JSON.stringify(time_slots)
            ],
            function(err) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve({ id: this.lastID, doctor_id, date, time_slots });
                }
            }
        );
    });
};

module.exports = {
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    setAvailability,
};