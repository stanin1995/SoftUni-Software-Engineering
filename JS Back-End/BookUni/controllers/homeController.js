const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const hotels = await req.storage.getAllHotels();

        res.render('home/home', { hotels });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
})

module.exports = router;