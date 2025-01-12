const { resolve } = require('path');
const db = require('../config/db');
const { reject } = require('bcrypt/promises');

const createRecord =  (record) => {
    return new Promise((resolve,reject) =>{
        const query = `
        INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescriptions, notes, test_results, treatments)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
            query,
            [
                record.patient_id,
                record.doctor_id,
                record.diagnosis,
                JSON.stringify(record.prescriptions),
                record.notes,
                JSON.stringify(record.test_results),
                JSON.stringify(record.treatments)
            ],
            function (err) {
                if(err){
                    reject(err.message);
                }else{
                    resolve({ id: this.lastID, ...record});
                }
            }
        );
    });
};

const getRecordsByPatientId = (patiendt_id) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * FROM medical_records
        WHERE patient_id = ?
        `;
        db.all(query,[patient_id], (err, rows) =>{
            if(err){
                reject(err.message);
            }else{
                resolve(rows);
            }
        });
    });
};

const updateRecord = (id, updates) => {
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE medical_records
        SET diagnosis = ?, prescriptions = ?, notes = ?, test_results = ?, treatments = ?
        WHERE id = ?
        `;
        db.run(
            query,
            [
                udpates.diagnosis,
                JSON.stringify(updates.prescriptions),
                updates.notes,
                JSON.stringify(updates.test_results),
                JSON.stringify(updates.treatments),
                id
            ],
            function(err){
                if(err){
                    reject(err.message);
                }else{
                    resolve({ changes: this.changes});
                }
            }
        );
    });
};

module.exports = { createRecord, getRecordsByPatientId, updateRecord };