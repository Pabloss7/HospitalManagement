const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departments.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.post('/departments', departmentController.createDepartment);
router.get('/departments', departmentController.getAllDepartments);
router.delete('/departments/:departmentId', 
    verifyToken, 
    checkRole(['admin']), 
    departmentController.deleteDepartment
);

module.exports = router;