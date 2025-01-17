const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbName = process.env.NODE_ENV === 'test' ? 'healthcare_test.db' : 'healthcare.db';
const db = new sqlite3.Database(
    path.resolve(__dirname, `../../${dbName}`),
    (err) => {
        if (err) {
            console.error('Connection db error', err.message);
        } else {
            console.log(`Connected to ${dbName}`);
        }
    }
);

module.exports = db;
