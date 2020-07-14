const express   = require('express');
const morgan    = require('morgan');
const app       = express();

const AppError  = require('./utils/appError'); 
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/ToursRoute');
const userRouter = require('./routes/UsersRoute');


//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//costom(User_defined) Middleware
app.use((req,res, next) => 
{

    req.requestTime = new Date().toISOString();
    next();

});


//function for routes

//TOURS

//USERS

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getViaId);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id' , deleteTour);

//ROUTE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//!error page
app.all('*',(req, res, next) =>{
    // res.status(404).json({
    //     status:'fail',
    //     message: `Can't find ${req.originalUrl} on this server !`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server !`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

//!Error handlers

app.use(globalErrorHandler);







//*export 
module.exports = app;