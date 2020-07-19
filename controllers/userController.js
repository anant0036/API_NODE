const User       = require('./../Models/userModal');
const catchAsync = require('./../utils/catchAsync');


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