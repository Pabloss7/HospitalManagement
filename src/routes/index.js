const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const departmentRoutes = require('./department.routes');
const adminRoutes = require('./admin.routes');
const doctorRoutes = require('./doctor.routes');
const appointmentRoutes = require('./appointment.routes');
const medicalRecordRoutes = require('./medical-record.routes');

// Basic test route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Hospital Management System' });
});


router.use('/', userRoutes);
router.use('/', departmentRoutes);
router.use('/admins', adminRoutes);
router.use('/', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/patients', medicalRecordRoutes);

module.exports = router;