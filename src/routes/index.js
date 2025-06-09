const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const departmentRoutes = require('./department.routes');

// Basic test route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Hospital Management System' });
});

// User routes
router.use('/', userRoutes);
router.use('/', departmentRoutes);

module.exports = router;