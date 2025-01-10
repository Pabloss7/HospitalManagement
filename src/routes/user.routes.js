const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search', userController.getUsersAdmin);
router.get('/:id',userController.getUserById);
router.put('/:id',userController.updateUser)


module.exports = router;