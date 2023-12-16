const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    shopAvatar: { type: String },
    isActivated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('shop', shopSchema);