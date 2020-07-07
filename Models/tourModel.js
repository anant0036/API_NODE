const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({

    name: 
    {
        type:String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim:true
    },
    duration:
    {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize:
    {
        type:Number,
        required: [true, 'A tour must have the groupSize']
    },
    difficulty:
    {
        type:String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingAverage: 
    {
        type: Number,
        default: 4.5
    },
    ratingQuantity:
    {
        type:Number,
        default:0
    },
    price: 
    {
        type: Number,
        required: [true, 'A tour must have a project']
    },
    priceDiscount:Number,
    summary:
    {
        type:String,
        trim:true,
        required:[true, 'A Tour must have a description']
    },
    description:
    {
        type:String,
        trim:true
    },
    imageCover:
    {
       type: String,
       required:[true,'A tour must have a cover image'] 
    },
    images: [String],
    createdAt:
    {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]

});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;









// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     rating: 4.7,
//     price: 497
// });

// testTour.save().then(doc =>{console.log(doc);}).catch(err => {console.log('ERROR:', err)});

