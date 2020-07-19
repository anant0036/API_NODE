const { promisify } = require('util');
const jwt        = require('jsonwebtoken');
const User       = require('./../Models/userModal');
const catchAsync = require('./../utils/catchAsync');
const AppError   = require('./../utils/appError');
const { json } = require('express');

//FUNCTION FOR THE TOKEN
const signToken = id =>
{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name:            req.body.name,
        email:           req.body.email,
        password:        req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    //!TOKEN AS IF SESSION IN THE SESSION IN THE PHP

    const token = signToken(newUser._id);


    res.status(201).json({
        status: 'success',
        token,
        data:{
            user: newUser
        }
    });
});

//!LOGIN THE USER AND TOKEN ALSO 

exports.login = catchAsync(async(req, res, next) =>
{
    const {email, password} = req.body;

    //todo 1) CHEAK IF EMAIL AND PASSWORD EXIST
    if(!email || !password)
    {
        return next(new AppError('PLEASE provide email amd password', 400));
    
    }

    //todo 2) CHEAK if user exist && password is correct
    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password)))
    {
        return next(new AppError('Incorrect email or password', 401));
    }

    //todo 3) Cheak if everything is ok send the token to the client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });


});

//MIDDLEWARE FOR CHEAKING THE TOKEN
exports.protect = catchAsync(async(req, res, next) => {
    //! 1) Getting token and cheak of it's there

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token)
    {
        return next(
            new AppError('You are not logged in! Plese log in to get access', 401)
        );
    }

    //! 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //! 3) Cheak if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser)
    {
        return next(
            new AppError('The user with this token does no longer exist.', 401)
        );
    }

    //! 4) Cheak if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) 
    {
        return next(new AppError('User recently changed password! please log in again',401));
    };
    //? GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});