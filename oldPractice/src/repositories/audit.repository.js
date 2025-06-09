const db = require('../config/db');

const logAction = (user_id, action, resource) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO audit_logs (user_id, action, resource)
            VALUES (?, ?, ?)
        `;
        db.run(query, [user_id, action, resource], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ id: this.lastID, user_id, action, resource });
            }
        });
    });
};

module.exports = { logAction };
