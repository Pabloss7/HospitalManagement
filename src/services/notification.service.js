const sendNotification = async (user_id, message) => {
    console.log(`Notification sent to User ID ${user_id}: ${message}`);
}

module.exports = { sendNotification };