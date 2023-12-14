const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true },
    avator: { type: String },
    isActivated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);