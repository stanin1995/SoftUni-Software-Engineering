const Hotel = require('../models/Hotel');


async function getAllHotels() {
    const hotels = await Hotel.find({}).lean();
    return hotels;
}

async function getHotelById(id) {
    const hotel = await Hotel.findById(id).lean();
    return hotel;
}

async function createHotel(hotelData) {
    const hotel = new Hotel({
        name: hotelData.name,
        city: hotelData.city,
        freeRooms: hotelData.freeRooms,
        imgUrl: hotelData.imgUrl,
        bookedUsers: hotelData.bookedUsers,
        owner: hotelData.owner
    });
    await hotel.save();

    return hotel;
}

async function editHotel(hotelData, id) {

}

async function deleteHotel(id) {

}


module.exports = {
    getAllHotels,
    getHotelById,
    createHotel,
    editHotel,
    deleteHotel
}