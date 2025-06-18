const { Log } = require('../models');

const logAction = async (action, userId, details) => {
    try {
        await Log.create({
            action,
            userId,
            details: JSON.stringify(details),
            timestamp: new Date()
        });
    } catch (error) {
        // Fallback to console.log in case of database errors
        console.error('Error storing log:', error);
        console.log(`[${new Date().toISOString()}] ${action} by user ${userId}: ${JSON.stringify(details)}`);
    }
};

module.exports = { logAction };