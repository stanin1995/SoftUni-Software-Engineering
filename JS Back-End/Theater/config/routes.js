const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const theaterController = require('../controllers/theaterController');



module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/theater', theaterController);
}