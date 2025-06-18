const { Log } = require('../models');

const logAction = async (action, userId, details) => {
    if (!action) {
        console.error('Action is required for logging');
        return;
    }

    try {
        // Ensure details is an object before stringifying
        const detailsStr = details ? JSON.stringify(details) : null;
        
        await Log.create({
            action: action.toString(), // Ensure action is a string
            userId: userId ? Number(userId) : null, // Ensure userId is a number or null
            details: detailsStr,
            timestamp: new Date()
        });
    } catch (error) {
        // Fallback to console.log in case of database errors
        console.error('Error storing log:', error);
        console.log(`[${new Date().toISOString()}] ${action} by user ${userId}: ${JSON.stringify(details)}`);
    }
};

module.exports = { logAction };