const express   = require('express');
const morgan    = require('morgan');
const app       = express();

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



// app.get('/', (req, res) =>
// {
//     res
//     .status(200)
//     .json({message:'hello from the server side!!  😎😎' , app:'Natours'});
// });

// app.post('/', (req, res) =>
// {
//     res
//     .send('You can post to this endpoint');
// });

//SERVER 
module.exports = app;