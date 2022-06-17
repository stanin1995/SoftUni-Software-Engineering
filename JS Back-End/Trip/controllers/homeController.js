const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        res.render('home/home');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});


module.exports = router;