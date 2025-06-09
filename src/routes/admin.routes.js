const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');


router.put('/patients/:patientID',
    verifyToken,
    checkRole(['admin']),
    adminController.modifyPatientInfo
);

module.exports = router;