const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialty.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/specialties', specialtyController.getSpecialties);
router.get('/departments', specialtyController.getDepartments);

router.post('specialties', authenticate(['admin','doctor','patient']), specialtyController.createSpecialty);
router.post('/departments', authenticate(['admin']), specialtyController.createDepartment);
router.post('/assign-specialty', authenticate(['admin']), specialtyController.assignSpecialty);

module.exports = router;