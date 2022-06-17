const User = require('../models/User');

async function createUser(email, hashedPassword, gender) {
    const user = new User({
        email,
        hashedPassword,
        gender,
        tripHistory: []
    });

    await user.save();

    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    const user = await User.findOne({ email: { $regex: pattern } });

    return user;
}

async function getDriver(id) {
    const driver = await User.findById(id);
    return driver.email
}

async function getUserById(id) {
    const user = await User.findById(id);
    const data = {
        email: user.email,
        gender: user.gender,
        tripHistory: user.tripHistory
    }

    return data;
}


module.exports = {
    createUser,
    getUserByEmail,
    getDriver,
    getUserById
}