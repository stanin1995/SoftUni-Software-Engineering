const tripService = require('../services/tripService');

module.exports = () => (req, res, next) => {
    //TODO import and decorate services
    req.storage = {
		...tripService
	};
	
	next();
}