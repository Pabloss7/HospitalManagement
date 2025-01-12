const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/',authenticate(['admin']), userController.createUser);
router.get('/',authenticate(['admin','doctor']), userController.getAllUsers);
router.get('/search',authenticate(['admin']), userController.getUsersAdmin);
router.get('/:id',authenticate(['admin','doctor','patient']),userController.getUserById);
router.put('/:id',authenticate(['admin','patient']),userController.updateUser)


module.exports = router;