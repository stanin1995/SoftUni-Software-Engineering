const { Schema, model } = require('mongoose');

const schema = new Schema({
    email: { type: String, reqired: true },
    hashedPassword: { type: String, reqired: true },
    gender: { type: String, reqired: true },
    tripHistory: [{ type: Schema.Types.ObjectId, ref: 'Trip', default: [] }],
});

module.exports = model('User', schema);