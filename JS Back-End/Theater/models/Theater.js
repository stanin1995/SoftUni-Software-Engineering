const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: [true, 'Title is reqiured!'] },
    description: { type: String, required: [true, 'Description is reqiured!'], maxLength: [50, 'Description must be less then 50 character long!'] },
    imgUrl: { type: String, required: [true, 'ImgUrl is reqiured!'] },
    public: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    usersLiked: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Theater', schema);