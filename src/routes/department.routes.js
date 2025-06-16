const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departments.controller');

router.post('/departments', departmentController.createDepartment);
router.get('/departments', departmentController.getAllDepartments);

module.exports = router;