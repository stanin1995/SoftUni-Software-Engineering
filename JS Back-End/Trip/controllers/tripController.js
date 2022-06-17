const router = require('express').Router();
const userService = require('../services/userService');
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');


router.get('/sharedtrips', async (req, res) => {
    try {
        const trips = await req.storage.getAllTrips();

        res.render('trip/shared', { trips });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.post('/create', isUser(), async (req, res) => {
    const data = {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        date: req.body.date,
        time: req.body.time,
        carImg: req.body.carImg,
        carBrand: req.body.carBrand,
        seats: Number(req.body.seats),
        price: Number(req.body.price),
        description: req.body.description,
        creator: req.user._id,
        buddies: [],
    }
    try {
        const isValidImg = req.body.carImg.match(/(http|https):\/\//g);
        if (!isValidImg) {
            throw new Error('Car image must be a valid URL')
        }
        await req.storage.createTrip(data);
        res.redirect('/trip/sharedtrips');
    } catch (err) {
        const ctx = {
            errors: parseError(err),
            data: {
                startPoint: req.body.startPoint,
                endPoint: req.body.endPoint,
                date: req.body.date,
                time: req.body.time,
                carImg: req.body.carImg,
                carBrand: req.body.carBrand,
                seats: Number(req.body.seats),
                price: Number(req.body.price),
                description: req.body.description
            }
        };
        res.render('trip/create', ctx);
    }
});

router.get('/create', isUser(), (req, res) => {
    try {
        res.render('trip/create');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id);
        if (req.user._id != trip.creator) {
            throw new Error('Cannot edit this trip! Not owner!')
        }

        res.render('trip/edit', { trip });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id);

        if (req.user._id != trip.creator) {
            throw new Error('Cannot edit this trip! Not owner!')
        }

        const data = {
            startPoint: req.body.startPoint,
            endPoint: req.body.endPoint,
            date: req.body.date,
            time: req.body.time,
            carImg: req.body.carImg,
            carBrand: req.body.carBrand,
            seats: Number(req.body.seats),
            price: Number(req.body.price),
            description: req.body.description,
        }

        req.storage.editTrip(req.params.id, data);

        res.redirect('/trip/details/' + req.params.id);
    } catch (err) {
        const ctx = {
            errors: parseError(err),
            data: {
                _id: req.params.id,
                startPoint: req.body.startPoint,
                endPoint: req.body.endPoint,
                date: req.body.date,
                time: req.body.time,
                carImg: req.body.carImg,
                carBrand: req.body.carBrand,
                seats: Number(req.body.seats),
                price: Number(req.body.price),
                description: req.body.description
            }
        };
        res.render('trip/edit', ctx);
    }
});

router.get('/details/:id', async (req, res) => {
    try {

        const trip = await req.storage.getTripById(req.params.id);

        let freeSeats = Number(trip.seats - trip.buddies.length);
        let availableSeats = false


        if (freeSeats > 0) {
            availableSeats = true;
        }

        const isUser = req.user;
        let isOwner = false;
        let isPassager = false;
        if (isUser) {
            isOwner = req.user._id == trip.creator;
            isPassager = trip.buddies.find(u => u._id == req.user._id);
        }
        const driver = await userService.getDriver(trip.creator);
        const buddies = trip.buddies.map(b => b.email).join(', ');


        const ctx = {
            trip,
            isUser,
            isOwner,
            isPassager,
            freeSeats,
            availableSeats,
            driver,
            buddies
        }

        res.render('trip/details', ctx);
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id);
        if (req.user._id != trip.creator) {
            throw new Error('Cannot delete this trip! Not owner!')
        }

        req.storage.deleteTrip(req.params.id);

        res.redirect('/trip/sharedtrips');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/join/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id);
        const isAuthor = req.user._id == trip.creator;
        if (isAuthor) {
            throw new Error('Cannot join your own trip!')
        }

        await req.storage.joinTrip(req.params.id, req.user._id);
        res.redirect('/trip/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/trip/details/' + req.params.id);
    }
});

module.exports = router;
