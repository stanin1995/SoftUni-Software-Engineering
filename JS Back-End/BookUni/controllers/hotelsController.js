const router = require('express').Router();
const { isUser } = require('../middlewares/guards');


router.get('/create', isUser(), (req, res) => {
    res.render('hotels/create')
});

router.post('/create', isUser(), async (req, res) => {
    const hotelData = {
        name: req.body.name,
        city: req.body.city,
        freeRooms: req.body.freeRooms,
        imgUrl: req.body.imgUrl,
        bookedUsers: [],
        owner: req.user._id
    }

    try {

        await req.storage.createHotel(hotelData);
        res.redirect('/');
    } catch (err) {

        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message)
        } else {
            errors = [err.message]
        }
        const ctx = {
            errors,
            hotelData: {
                name: req.body.name,
                city: req.body.city,
                freeRooms: req.body.freeRooms,
                imgUrl: req.body.imgUrl
            }
        }
        res.render('hotels/create', ctx);
    }
});

router.get('/details/:id', isUser(), async (req, res) => {


    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        const isOwner = req.user._id == hotel.owner;
        const isBooked = hotel.bookedUsers.includes(req.user._id);


        const ctx = {
            hotel,
            isOwner,
            isBooked,
        }

        res.render('hotels/details', ctx);
    } catch (err) {
        console.log(err.message);
        res.redirect('/')
    }
});


module.exports = router;