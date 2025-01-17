const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const {notify} = require('../middlewares/notification.middleware');

router.post(
    '/',
    authenticate(['doctor']),
    audit('CREATE', 'medical_record'),
    notify('patient_id', 'A new medical record has been added to your profile'),
    medicalRecordController.createRecord
);
router.get(
    '/',
    authenticate(['patient','doctor','admin']),
    medicalRecordController.getMyRecords
);
router.get(
    '/doctor',
    authenticate(['doctor', 'admin']),
    medicalRecordController.getRecordsByDoctor
);
router.put(
    '/:id',
    authenticate(['doctor']),
    audit('UPDATE', 'medical_record'), 
    notify('patient_id', 'Your medical record has been updated'),
    medicalRecordController.updateRecord
);

module.exports = router;