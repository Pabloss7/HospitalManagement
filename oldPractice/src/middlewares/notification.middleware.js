const notificationService = require('../services/notification.service');

const notify  = (userKey, message) => {
    return async (req, res, next) => {
        try{
            const user_id = userKey === 'patient_id' ? req.body.patient_id : req.body.doctor_id;

            if(user_id){
                await notificationService.sendNotification(user_id, message);
                console.log(`Notification send to patient ID ${user_id}: ${message}`);
            }else{
                console.warn(`Notification not sent:${userKey} not found in request`);
            }
        }catch(error){
            console.error('Error sending notification:', error.message);
        }
        next();
    };
};

module.exports = { notify };