const express = require ('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


//USERS

const router = express.Router();

//!USER Signup & Login
router.post('/signup', authController.signup);
router.post('/login', authController.login);
//! Password Forget & Reset
router.post('/forgetPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);


router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.get(
    '/me',
    authController.protect,
    userController.getMe,
    userController.getUserId
);



//! Updating other details
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.use(authController.restrictTo('admin'));

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