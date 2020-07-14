const AppError = require('./../utils/appError');

// const handleCastErrorDB = err =>
// {
//     const message = `Invalid ${err.path}: ${err.value}`;
//     return new AppError(message,400);
// }



module.exports = (err, req, res, next) =>
{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //todo let error = (...err);
    //todo if (error.name === 'CastError') error = handleCastErrorDB(error);
    //todo if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    //todo if(error.name === 'validationerror') error = handleValidationerror(error);
    res.status(err.statusCode).json(
        {
            status: err.status,
            message: err.message
        });
};