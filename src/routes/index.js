const express = require('express');
const router = express.Router();

// Basic test route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Hospital Management System' });
});

module.exports = router;