const { isGuest, isUser } = require('../middlewares/guards');
const userService = require('../services/userService');


const router = require('express').Router();


router.get('/register', isGuest(), (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest(), async (req, res) => {
    //Validation for username, pass, etc...

    try {
        if (!req.body.email || !req.body.password || !req.body.rePass) {
            throw new Error('All fields are required!')
        }
        if (req.body.password != req.body.rePass) {
            throw new Error('Password\'s don\'t match!')
        }
        if (req.body.password.length < 4) {
            throw new Error('Password must be at least 4 characters long!')
        }
        const isValidEmail = req.body.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g);
        if (!isValidEmail) {
            throw new Error('Email is not valid!')
        }

        await req.auth.register(req.body.email, req.body.password, req.body.gender,);

        res.redirect('/'); //Change redirect! 
    } catch (err) {
        const ctx = {
            errors: [err.message],
            userData: {
                email: req.body.email,
                gender: req.body.gender
            }
        }
        res.render('auth/register', ctx);
    }

});

router.get('/login', isGuest(), (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest(), async (req, res) => {

    try {

        if (!req.body.email || !req.body.password) {
            throw new Error('All fields are required!')
        }

        await req.auth.login(req.body.email, req.body.password);

        res.redirect('/'); //Change redirect! 
    } catch (err) {

        const ctx = {
            errors: [err.message],
            userData: {
                email: req.body.email
            }
        }
        res.render('auth/login', ctx);
    }
});

router.get('/logout', async (req, res) => {
    await req.auth.logout();
    res.redirect('/');
});

router.get('/profile', isUser(), async (req, res) => {
    try {
        const user = await userService.getUserById(req.user._id);

        const userTripsHistory = [];
        for (const trip of user.tripHistory) {
            const currentTrip = await req.storage.getTripById(trip);
            userTripsHistory.push(currentTrip);
        }

        res.render('auth/profile', { user, userTripsHistory })
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});


module.exports = router;