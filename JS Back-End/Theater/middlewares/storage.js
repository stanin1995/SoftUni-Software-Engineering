const theaterService = require('../services/theaterService');

module.exports = () => (req, res, next) => {
    //TODO import and decorate services
    req.storage = {
        ...theaterService
    };
    next();
}