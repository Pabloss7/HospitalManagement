const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');


router.put('/patients/:patientID',
    verifyToken,
    checkRole(['admin']),
    adminController.modifyPatientInfo
);

router.get('/patients',
    verifyToken,
    checkRole(['admin']),
    adminController.getAllPatients
);

module.exports = router;