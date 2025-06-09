const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const departmentRoutes = require('./department.routes');
const adminRoutes = require('./admin.routes');

// Basic test route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Hospital Management System' });
});


router.use('/', userRoutes);
router.use('/', departmentRoutes);
router.use('/admin', adminRoutes);
module.exports = router;