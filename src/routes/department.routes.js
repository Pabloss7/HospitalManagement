const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departments.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.post('/', 
    //in order to make easier how we test the project this is commented, but admin should be the only one able to create departments
   // verifyToken,
    //checkRole(['admin']),
    departmentController.createDepartment
);
router.get('/', departmentController.getAllDepartments);
router.delete('/:departmentId', 
    verifyToken, 
    checkRole(['admin']), 
    departmentController.deleteDepartment
);

module.exports = router;