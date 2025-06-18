const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.put('/patients/:patientID',
    verifyToken,
    checkRole(['admin']),
    adminController.modifyPatientInfo
);

router.put('/doctors/:doctorId',
    verifyToken,
    checkRole(['admin']),
    adminController.modifyDoctorInfo
);

router.get('/patients',
    verifyToken,
    checkRole(['admin']),
    adminController.getAllPatients
);

router.get('/logs',
    verifyToken,
    checkRole(['admin']),
    adminController.getAllLogs
);

module.exports = router;