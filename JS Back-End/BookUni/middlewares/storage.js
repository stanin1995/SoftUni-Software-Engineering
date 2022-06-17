const hotelService = require('../services/hotelService');

module.exports = () => (req, res, next) => {
    //TODO import and decorate services
    req.storage = {
        ...hotelService
    };
    next();
}