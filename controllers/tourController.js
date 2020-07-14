const fs    = require('fs');
const Tour  = require('./../Models/tourModel'); 
const APIFeature = require('./../utils/apiFeature');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const { match } = require('assert');

exports.aliasTopTours = (req, res, next) =>
{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.cheakID = (req,res,next,val) =>
// {
//     if(req.params.id * 1 > tours.length)
//     {
//         return res
//         .status(404)
//         .json
//         ({

//             status: 'fail',
//             message: 'Invaild Id' 

//         });
//     }
//     next();
// };

// exports.cheakBody = (req,res,next) =>
// {
//     if(!req.body.name || !req.body.price)
//     {
//         return res
//         .status(400)
//         .json
//         ({
//            status: 'fail',
//            message: 'Missing name or price' 
//         })
//     }
//     next();
// }







exports.getAllTours = catchAsync(async (req, res, next) => {
   
     //EXECUTE QUERY
        const features = new APIFeature(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const tours = await features.query;

        //SEND RESPONSE
        res
        .status(200)
        .json
        ({
            status:'success',
            results: tours.length,
            data:
            {
                tours
            }
        });       
});

exports.getViaId = catchAsync(async (req, res, next) => {

        const tours = await Tour.findById(req.params.id);

        if(!tours)
        {
           return next(new AppError('No tour is find with this ID', 404))
        }

        res.status(200).json({
            status: 'success',
            data:{
                tours
            }
        });
        

});




exports.createTour = catchAsync(async (req, res, next) => {
// FIRST WAY
//const newTour = new Tour({})
//newTour.save()
const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data:{
            tour: newTour
        }
    });
});

exports.updateTour = catchAsync(async (req,res,next) => {
    
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
    new: true,
    runValidators: true
    });

    if(!tour)
    {
        return next(new AppError('No tour is find with this ID', 404))
    }

    res.status(200)
    .json
    ({
    status: 'success',
    data:
    {
        tour
    }
    });
    

});

exports.deleteTour = catchAsync(async (req, res, next) => 
{
    const tour =  await Tour.findByIdAndDelete(req.params.id);

    if(!tour)
    {
        return next(new AppError('No tour is find with this ID', 404))
    }

        res.status(204)
        .json
        ({
            status: 'success',
            data: null
        });
    
});

//Aggigation

exports.getTourStats = async (req, res) =>
{
    try
    {

        const stats = await Tour.aggregate
        ([
            {
                $match: { ratingAverage: { $gte: 4.5 }}
            },
            {
                $group: 
                {
                    _id: '$difficulty',
                    numTours: { $sum: 1},
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
                
            },
            {
                $sort:
                {
                    avgPrice: 1
                }
            }
        ]);

        res.status(200)
        .json
        ({
            status: 'success',
            data:{
                stats
            }
        });

    }
    catch(err)
    {

        res.status(404).json({
            status: 'fail',
            message: err
        });

    }
};

//NEXT AGGRIGATION
exports.getMonthlyPlan = async(req,res) => {

    try
    {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match:
                {
                    startDates:
                    {
                        $gte:new Date(`$(year)-01-01`),
                        $lte:new Date(`$(year)-12-31`)
                    }
                }
            },
            {
                $group:
                {
                    _id:{ $month: '$startDates' },
                    numTourStart: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            status:'success',
            data:{
                plan
            }
        });
    }
    catch(err)
    {
        res.status(404).json(
            {
                status:'fail',
                message: err
            }
        );
    }

};
