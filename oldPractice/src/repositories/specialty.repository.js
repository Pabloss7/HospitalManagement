const db = require('../config/db');

const getSpecialties = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM specialties', [], (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
};

const getDepartments = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM departments', [], (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
};

const createSpecialty = (name) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO specialties (name) VALUES (?)';
        db.run(query, [name], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ id: this.lastID, name });
            }
        });
    });
};

const createDepartment = (name) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO departments (name) VALUES (?)';
        db.run(query, [name], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ id: this.lastID, name });
            }
        });
    });
};

const assignSpecialtyToDoctor = (doctor_id, specialty_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO doctor_specialties (doctor_id, specialty_id)
            VALUES (?, ?)
        `;
        db.run(query, [doctor_id, specialty_id], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ id: this.lastID, doctor_id, specialty_id });
            }
        });
    });
};

module.exports = {
    getSpecialties,
    getDepartments,
    createSpecialty,
    createDepartment,
    assignSpecialtyToDoctor,
};
