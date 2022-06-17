const homeController = require('../controllers/homeController');


module.exports = (app) => {

    app.use('/', homeController);

    app.use((err, req, res, next) => {
        console.log('---', err.message);

        res.status(500).send('Something happened');
    });
}