const express = require ('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


//USERS

const router = express.Router();

//!signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUserId)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;