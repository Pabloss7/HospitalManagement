const { resolve } = require('path');
const db = require('../config/db');
const { rejects } = require('assert');

const createUser = (username,password, role, details) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO users (username, password, role, details)
        VALUES (?, ?, ?, ?)
        `;
        db.run(query, [username,password,role, JSON.stringify(details)], function(err){
            if (err){
                reject(err.message);
            }else{
                resolve({id: this.lastID, username, role, details});
            }
        });
    });
};

const getUser = (id) => {
    return new Promise((resolve, reject) =>{
        const query = `
        SELECT id,username,role,details FROM users
        WHERE id = ?
        `;
        db.get(query, [id],(err,row) =>{
            if(err){
                reject(err.message);
            }else if(!row){
                reject('User not found');
            }else{
                resolve(row);
            }
        })
    });
}

const updateUser = (id, username) =>{
    return new Promise((resolve, reject)  =>{
        const query = `
        UPDATE users SET username = ? 
        WHERE id = ?
        `;
        db.run(query, [username,id], (err, row) =>{
            if(err){
                reject(err.message);
            }else if(this.changes === 0){
                reject('User not found');
            }else{
                resolve({id,username});
            }
        })
    });
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id,username,role,details FROM users', [], (err, rows) => {
            if (err) {
              reject(err.message);
            } else {
              resolve(rows);
            }
        });
    });
};

const getUsersAdmin = () =>{
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users',[],(err, rows) => {
            if(err){
                reject(err.message);
            }else{
                resolve(rows);
            }
        });
    });
};

const findByUsername = (username) => {
    return new Promise((resolve, reject) =>{
        const query = `
        SELECT * FROM users
        WHERE username = ?
        `;
        db.get(query, [username], (err, row) =>{
            if(err){
                reject(err.message);
            }else{
                resolve(row);
            }
        });
    });
};
      
module.exports = { createUser, getAllUsers,getUser ,updateUser, getUsersAdmin, findByUsername};