const sqlite3 = require('sqlite3').verbose();

// Create a new database instance
const db = new sqlite3.Database('./hospital_management.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
