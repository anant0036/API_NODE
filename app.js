const fs        = require('fs');
const express   = require('express');
const morgan    = require('morgan');
const app       = express();
const port      = 3000;

//middleware
app.use(morgan('dev'));
app.use(express.json());

//costom(User_defined) Middleware
app.use((req,res, next) => 
{

    req.requestTime = new Date().toISOString();
    next();

});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//function for routes

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status:'success',
        results: tours.length,
        data:{
            tours:tours
        }
    })
};

const getViaId = (req,res) => {
    
    const id = req.params.id * 1;

    if(id > tours.length)
    {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const tour = tours.find(el => el.id === id)

    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    })


};

const createTour = (req, res) => {

    const newId   = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

};

const updateTour = (req,res) => {

    if(req.params.id * 1 > tours.length)
    {
        return res
        .status(404)
        .json
        ({
            status: 'fail',
            message: 'Invalid id'
        });
    }

    res.status(200)
    .json
    ({
        status: 'success',
        data:
        {
            tour: 'update tour here!!!....'
        }
    });

};

const deleteTour = (req, res) => 
{

    if(req.params.id * 1 > tours.length)
    {
        return res
        .status(404)
        .json
        ({

            status: 'fail',
            message: 'Invaild Id' 

        });
    }

    res.status(204)
    .json
    ({
        status: 'success',
        data: null
    });

};


// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getViaId);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id' , deleteTour);

//ROUTE
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getViaId)//id
    .patch(updateTour)
    .delete(deleteTour);




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
app.listen(port, () =>
{
    console.log(`App Running on port ${port}😴😴`);
});