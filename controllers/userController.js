const User       = require('./../Models/userModal');
const catchAsync = require('./../utils/catchAsync');
const AppError   = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) =>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.getAllUsers = catchAsync(async (req, res, next) =>
{
    const users = await User.find();

    //SEND RESPONSE
    res.status(200).json({
        status:  'success',
        results: users.length,
        data:
        {
            users
        }
    });
});

exports.updateMe = catchAsync(async(req, res, next) =>{
    if(req.body.password || req.body.passwordConfirm)
    {
        return next(new AppError('This route is not password updates . Please use /updateMyPassword.', 400));
    }

    //! 2) Update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// exports.deleteUser = catchAsync(async (req, res, next) => {
//     await User.findByIdAndUpdate(req.user.id, { active: false });

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });



exports.createUser = (req,res) => 
{

    res
    .status(500)
    .json
    ({
        status: 'error',
        message: 'This route is not yet Defined 😋🤨....'
    });

}

exports.getUserId = (req,res) => 
{

    res
    .status(500)
    .json
    ({
        status: 'error',
        message: 'This route is not yet Defined 😋🤨....'
    });

}

exports.updateUser = (req,res) => 
{

    res
    .status(500)
    .json
    ({
        status: 'error',
        message: 'This route is not yet Defined 😋🤨....'
    });

}

exports.deleteUser = (req,res) => 
{

    res
    .status(500)
    .json
    ({
        status: 'error',
        message: 'This route is not yet Defined 😋🤨....'
    });

}