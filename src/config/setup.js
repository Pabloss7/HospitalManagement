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
            CREATE TABLE IF NOT EXISTS appointments (
            
            )
            `);
    });
};

setupDatabase();