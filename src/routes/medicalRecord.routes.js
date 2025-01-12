const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');

const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate(['doctor']), medicalRecordController.createRecord);
router.get('/', authenticate(['patient','doctor','admin']), medicalRecordController.getMyRecords);
router.put('/:id', authenticate(['doctor']), medicalRecordController.updateRecord);

module.exports = router;