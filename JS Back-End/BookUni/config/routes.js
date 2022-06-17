const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const hotelsController = require('../controllers/hotelsController');



module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/hotels', hotelsController);
}