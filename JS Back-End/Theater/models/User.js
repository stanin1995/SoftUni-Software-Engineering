const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: { type: String, reqired: true },
    hashedPassword: { type: String, reqired: true },
    likedTheaters: [{ type: Schema.Types.ObjectId, ref: 'Theater' }],
});

module.exports = model('User', schema);