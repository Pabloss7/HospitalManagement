const logAction = async (action, userId, details) => {
    console.log(`[${new Date().toISOString()}] ${action} by user ${userId}: ${JSON.stringify(details)}`);
    // In a production environment, you would want to store this in a database or log file
};

module.exports = { logAction };