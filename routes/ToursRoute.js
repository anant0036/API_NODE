const express        = require ('express');
const tourController = require('./../controllers/tourController');
const { route } = require('./UsersRoute');

//ROUTES
const router = express.Router();

router.param('id', tourController.cheakID);


router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.cheakBody, tourController.createTour);

router
    .route('/:id')
    .get(tourController.getViaId)//id
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;