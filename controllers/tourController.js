const fs    = require('fs');
const Tour  = require('./../Models/tourModel'); 
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


exports.getAllTours = async (req, res) => {
   try
   {
        //BUILD QUERY
        //1A) filtering
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // console.log(req.query, queryObj);
        
        // 1B Advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // 2 Sorting
        if(req.query.sort)
        {
            const sortBy = req.query.sort.split(',').join(' ');

            query = query.sort(sortBy);
        }
        else
        {
            query = query.sort('-createdAt');
        }

        //3 FIELD LIMITING
        if(req.query.fields)
        {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else
        {
            query = query.select('-__v');
        }

        //4 PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip  = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page)
        {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist');
        }

        //EXECUTE QUERY
        const tours = await query;

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
   }
   catch(err)
   {
       res.status(404).json({
           status: 'fail',
           message: err
       });
   }
    
    
    
};

exports.getViaId = async(req,res) => {
    try
    {
        const tours = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data:{
                tours
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

exports.createTour = async (req, res) => {
try
{
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
} 
catch (err)
{
    res.status(400).json({
        status: 'fail',
        message: 'Invalid Data sent!'
    });
}


};

exports.updateTour = async (req,res) => {
    try
    {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });
        res.status(200)
        .json
        ({
            status: 'success',
            data:
            {
                tour
            }
        });
    }
    catch(err)
    {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Data sent!'
        });
    }
    

};

exports.deleteTour = async(req, res) => 
{
    try
    {
        const tour =  await Tour.findByIdAndDelete(req.params.id);

        res.status(204)
        .json
        ({
            status: 'success',
            data: null
        });
    }
    catch(err)
    {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Data sent!'
        });
    }
    

};