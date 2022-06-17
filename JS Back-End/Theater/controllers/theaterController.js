const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');


router.get('/create', isUser(), (req, res) => {
    try {
        res.render('theater/create');
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.post('/create', isUser(), async (req, res) => {
    const data = {
        title: req.body.title,
        description: req.body.description,
        imgUrl: req.body.imgUrl,
        public: Boolean(req.body.public),
        createdAt: new Date(),
        usersLiked: [],
        author: req.user._id,
    }

    try {
        await req.storage.createTheater(data);
        res.redirect('/');
    } catch (err) {
        const ctx = {
            errors: parseError(err),
            data: {
                title: req.body.title,
                description: req.body.description,
                imgUrl: req.body.imgUrl,
                public: Boolean(req.body.public)
            }
        };
        res.render('theater/create', ctx);
    }
});

router.get('/details/:id', isUser(), async (req, res) => {
    try {
        const theater = await req.storage.getTheaterById(req.params.id);

        const isAuthor = req.user._id == theater.author
        const isLiked = theater.usersLiked.find(u => u._id == req.user._id);

        const ctx = {
            theater,
            isAuthor,
            isLiked
        }
        res.render('theater/details', ctx);
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const theater = await req.storage.getTheaterById(req.params.id);
        const isAuthor = req.user._id == theater.author;
        if (!isAuthor) {
            res.redirect('/');
        }

        res.render('theater/edit', { theater });
    } catch (err) {
        console.log(err.message);
        res.render('theater/edit');
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const theater = await req.storage.getTheaterById(req.params.id);
        const isAuthor = req.user._id == theater.author;
        if (!isAuthor) {
            res.redirect('/');
        }

        await req.storage.editTheater(req.params.id, req.body);

        res.redirect('/theater/details/' + req.params.id);
    } catch (err) {

        const ctx = {
            errors: parseError(err),
            theater: {
                _id: req.params.id,
                title: req.body.title,
                description: req.body.description,
                imgUrl: req.body.imgUrl,
                public: Boolean(req.body.public)
            }
        }
        res.render('theater/edit', ctx)
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const theater = await req.storage.getTheaterById(req.params.id);
        const isAuthor = req.user._id == theater.author;
        if (!isAuthor) {
            res.redirect('/');
        }

        await req.storage.deleteTheater(req.params.id)
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.render('/');
    }
});

router.get('/like/:id', isUser(), async (req, res) => {
    try {
        const theater = await req.storage.getTheaterById(req.params.id);
        const isAuthor = req.user._id == theater.author;
        if (isAuthor) {
            throw new Error('Cannot like your own theater!')
        }

        await req.storage.likeTheater(req.params.id, req.user._id);
        res.redirect('/theater/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/theater/details/' + req.params.id);
    }
});

module.exports = router;
