const Theater = require('../models/Theater');

async function getAllTheaters() {
    return Theater.find({ public: true }).sort({ createdAt: -1 }).lean();
}

async function getTheaterById(id) {
    return Theater.findById(id).populate('usersLiked').lean();
}

async function createTheater(data) {
    const pattern = new RegExp(`^${data.title}$`, 'i');
    const existing = await Theater.find({ title: { $regex: pattern } });

    if (!existing) {
        throw new Error('A theater with this name already exist!');
    }
    const theater = new Theater(data);
    await theater.save();
    return theater;
}

async function editTheater(id, data) {
    const theater = await Theater.findById(id);

    theater.title = data.title;
    theater.description = data.description;
    theater.imgUrl = data.imgUrl;
    theater.public = Boolean(data.public);

    return theater.save();
}

async function deleteTheater(id) {
    return Theater.findByIdAndDelete(id);
}

async function likeTheater(theaterId, userId) {
    const theater = await Theater.findById(theaterId);

    theater.usersLiked.push(userId);
    return theater.save();

}


module.exports = {
    getAllTheaters,
    getTheaterById,
    createTheater,
    editTheater,
    deleteTheater,
    likeTheater
}