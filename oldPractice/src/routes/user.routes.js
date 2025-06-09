const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const  { audit } = require('../middlewares/audit.middleware');

router.post('/',authenticate(['admin']), audit('CREATE', 'user'), userController.createUser);
router.get('/',authenticate(['admin','doctor']), userController.getAllUsers);
router.get('/search',authenticate(['admin']), userController.getUsersAdmin);
router.get('/:id',authenticate(['admin','doctor','patient']),userController.getUserById);
router.put('/:id',authenticate(['admin','patient']),audit('UPDATE', 'user'),userController.updateUser);


module.exports = router;