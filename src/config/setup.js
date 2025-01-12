const db = require('./db');

const setupDatabase = () => {
    db.serialize(() =>{
        //User table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
                details TEXT
            )
        `, (err) =>{
            if(err){
                console.error('Error creating user table',err.message);
            }else{
                console.log('User table created or existing');
            }
        });
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
              console.error('Error al crear la tabla de registros médicos:', err.message);
            } else {
              console.log('Tabla de registros médicos creada o existente.');
            }
          });
        // db.run(`
        //     CREATE TABLE IF NOT EXISTS appointments (
            
        //     )
        //     `);
    });
};

setupDatabase();