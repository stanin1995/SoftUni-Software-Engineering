const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');
const { TOKEN_SECRET, COOKIE_NAME } = require('../config')


module.exports = () => (req, res, next) => {

    if (parseToken(req, res)) {
        req.auth = {
            async register(email, username, password) {
                const token = await register(email, username, password);
                res.cookie(COOKIE_NAME, token);
            },
            async login(username, password) {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token);
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };
        next();
    };
};



async function register(email, username, password) {
    //TODO make for current project
    //TODO extra validations

    const existUsername = await userService.getUserByUsername(username);
    const existEmail = await userService.getUserByUsername(email);


    if (existUsername) {
        throw new Error('Username is already use!');
    }
    if (existEmail) {
        throw new Error('Email is already use!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userService.createUser(email, username, hashedPassword);

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);
    if (!user) {
        throw new Error('No such user!');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorect password!');
    }

    return generateToken(user);
}


function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        username: userData.username,
        email: userData.email
    }, TOKEN_SECRET);
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            res.locals.user = userData;
        } catch (err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
            return false;
        }
    }
    return true;
}