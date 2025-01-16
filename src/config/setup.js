const db = require('./db');

const setupDatabase = () => {
    db.serialize(() => {
        // User table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
                details TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating user table:', err.message);
            } else {
                console.log('User table created or existing');
            }
        });

        // Medical Records table
        db.run(`
            CREATE TABLE IF NOT EXISTS medical_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                diagnosis TEXT,
                prescriptions TEXT,
                notes TEXT,
                test_results TEXT,
                treatments TEXT,
                FOREIGN KEY(patient_id) REFERENCES users(id),
                FOREIGN KEY(doctor_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating medical_records table:', err.message);
            } else {
                console.log('Medical Records table created or existing');
            }
        });

        // Appointments table
        db.run(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'cancelled')),
                FOREIGN KEY(patient_id) REFERENCES users(id),
                FOREIGN KEY(doctor_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating appointments table:', err.message);
            } else {
                console.log('Appointments table created or existing');
            }
        });

        // Availability table for doctors
        db.run(`
            CREATE TABLE IF NOT EXISTS availability (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doctor_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                time_slots TEXT NOT NULL,
                FOREIGN KEY(doctor_id) REFERENCES users(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating availability table:', err.message);
            } else {
                console.log('Availability table created or existing');
            }
        });
    });
};

setupDatabase();
