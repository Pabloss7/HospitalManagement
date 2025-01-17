const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

router.get(
    '/doctors',
    publicController.getPublicDoctors
);
router.get(
    '/departments',
    publicController.getPublicDepartments
);
module.exports = router;