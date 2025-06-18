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
            action: action.toString(), 
            userId: userId ? Number(userId) : null,
            details: detailsStr,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error storing log:', error);
        console.log(`[${new Date().toISOString()}] ${action} by user ${userId}: ${JSON.stringify(details)}`);
    }
};

module.exports = { logAction };