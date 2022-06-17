const { Schema, model } = require('mongoose');

const schema = new Schema({
    startPoint: { type: String, required: [true, 'Start point is required!'], minLength: [4, 'Startpoint must be at least 4 characters long '] },
    endPoint: { type: String, required: [true, 'End point is required!'], minLength: [4, 'Startpoint must be at least 4 characters long '] },
    date: { type: String, required: [true, 'Date is required!'] },
    time: { type: String, required: [true, 'Time is required!'] },
    carImg: { type: String, required: [true, 'Car image is reqiured!'] },
    carBrand: { type: String, required: [true, 'Car Brand is reqiured!'], min: [4, 'Seats must be between 0 or 4!'] },
    seats: { type: Number, required: [true, 'Seats is reqiured!'], min: [0, 'Seats must be between 0 or 4!'], max: [4, 'Seats must be between 0 or 4!'] },
    price: { type: Number, required: [true, 'Price is reqiured!'], min: [1, 'Price must be between 1 or 150!'], max: [150, 'Price must be between 1 or 150!'] },
    description: { type: String, required: [true, 'Description is reqiured!'] },
    buddies: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Trip', schema);