const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const medicalRecordController = require('../controllers/medical-record.controller');

router.post('/:patientId/records',
  verifyToken,
  checkRole(['doctor']),
  medicalRecordController.createMedicalRecord
);

router.put('/:patientId/records/:recordId',
  verifyToken,
  checkRole(['doctor']),
  medicalRecordController.updateMedicalRecord
);

router.get('/:patientId/records',
  verifyToken,
  checkRole(['patient']),
  medicalRecordController.getPatientRecords
);

module.exports = router;