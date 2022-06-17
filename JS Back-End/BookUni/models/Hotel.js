const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: [true, 'All fields are required!'], minLength: 4 },
    city: { type: String, required: [true, 'All fields are required!'], minLength: 3 },
    freeRooms: { type: Number, required: [true, 'All fields are required!'], min: [1, 'Rooms must be between 1 and 100'], max: [100, 'Rooms must be between 1 and 100'] },
    imgUrl: { type: String, required: [true, 'All fields are required!'], match: [/^https?/, 'Image must be a valid URL!'] },
    bookedUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Hotel', schema);