const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User signup route
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/findUser', userController.findUserByEmail);
router.patch('/updateUser/:id', userController.updateUserById);
router.get('/getFeed', userController.getFeed);
router.patch('/deleteUser/:id', userController.deleteUserById);

module.exports = router;
