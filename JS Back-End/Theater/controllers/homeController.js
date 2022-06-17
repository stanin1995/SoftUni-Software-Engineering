const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const theaters = await req.storage.getAllTheaters();

        res.render('home', { theaters });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});


module.exports = router;
