const { isGuest } = require('../middlewares/guards');

const router = require('express').Router();


router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register', isGuest(), async (req, res) => {
    //Validation for username, pass, etc...

    try {

        if (!req.body.email || !req.body.username || !req.body.password || !req.body.rePass) {
            throw new Error('All fields are required!')
        }
        if (req.body.password !== req.body.rePass) {
            throw new Error('Password\'s don\'t match!')
        }
        
        await req.auth.register(req.body.email, req.body.username, req.body.password);

        res.redirect('/'); //Change redirect! 
    } catch (err) {
        const ctx = {
            errors: err.message,
            userData: {
                email: req.body.email,
                username: req.body.username
            }
        }
        res.render('user/register', ctx);
    }
});

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {

    try {

        if (!req.body.username || !req.body.password) {
            throw new Error('All fields are required!')
        }

        await req.auth.login(req.body.username, req.body.password);

        res.redirect('/'); //Change redirect! 
    } catch (err) {
        const ctx = {
            errors: err.message,
            userData: {
                username: req.body.username
            }
        }
        res.render('user/login', ctx);
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});


module.exports = router;