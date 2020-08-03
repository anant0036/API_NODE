const fs    = require('fs');
const Tour  = require('./../Models/tourModel'); 
const APIFeature = require('./../utils/apiFeature');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory  = require('./handlerFactory');

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







exports.getAllTours = factory.getAll(Tour);

exports.getViaId    = factory.getOne(Tour, { path: 'reviews' });

exports.createTour  = factory.createOne(Tour);

exports.updateTour  = factory.updateOne(Tour);

exports.deleteTour  = factory.deleteOne(Tour);


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
