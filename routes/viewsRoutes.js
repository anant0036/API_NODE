const express = require('express');
const app = require('../app');
const router = express.Router();
const authController = require('../controllers/authController')
const viewsController = require('../controllers/viewsController');

// app.get('/', (req, res) => {
//     res.status(200).render('base');
// });
  
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
  