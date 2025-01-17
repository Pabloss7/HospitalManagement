const db = require('../config/db');

const getPublicDoctors = () => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT u.id AS doctor_id, u.username AS name, GROUP_CONCAT(s.name) AS specialties
        FROM users u
        JOIN doctor_specialties ds ON u.id = ds.doctor_id
        JOIN specialties s ON ds.specialty_id = s.id
        WHERE u.role = 'doctor'
        GROUP BY u.id
        `;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
};

const getPublicDepartments = () => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT id, name FROM departments
        `;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = { getPublicDoctors, getPublicDepartments };
