const Trip = require('../models/Trip');
const User = require('../models/User');


async function getAllTrips() {
    return Trip.find({}).lean();
}

async function getTripById(id) {
    return Trip.findById(id).populate('buddies').lean();
}

async function createTrip(data) {
    const trip = new Trip(data);
    await trip.save();
    return trip;
}


async function editTrip(id, data) {
    let trip = await Trip.findById(id);


    trip.startPoint = data.startPoint
    trip.endPoint = data.endPoint
    trip.date = data.date
    trip.time = data.time
    trip.carImg = data.carImg
    trip.carBrand = data.carBrand
    trip.seats = Number(data.seats)
    trip.price = Number(data.price)
    trip.description = data.description


    return trip.save();
}


async function deleteTrip(id) {
    return Trip.findByIdAndDelete(id);
}

async function joinTrip(tripId, userId) {
    const trip = await Trip.findById(tripId);
    const user = await User.findById(userId);


    if (trip.buddies.includes(userId)) {
        throw new Error('You already join!')
    }

    if (user.tripHistory.includes(tripId)) {
        throw new Error('You already join!')
    }

    trip.buddies.push(userId);
    user.tripHistory.push(tripId);
    await trip.save();
    await user.save();

    return user, trip;

}



module.exports = {
    getAllTrips,
    getTripById,
    createTrip,
    editTrip,
    deleteTrip,
    joinTrip
}