const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: { type: String, reqired: true },
    username: { type: String, reqired: true },
    hashedPassword: { type: String, reqired: true },
    bookedHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel', default: [] }],
    ownedHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel', default: [] }]
});

module.exports = model('User', schema);