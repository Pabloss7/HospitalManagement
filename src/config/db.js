const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//Creation of the db
const db = new sqlite3.Database(
    path.resolve(__dirname,'../../healtcare.db'),
    (err) => {
        if(err){
            console.error('Connection db error', err.message);
        }else{
            console.log('Connected to db');
        }
    }
)

module.exports = db;