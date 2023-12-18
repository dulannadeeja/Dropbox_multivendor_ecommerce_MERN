const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: false },
    zip: { type: String, required: false },
    street: { type: String, required: false },
    apartment: { type: String, required: false },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('shop', shopSchema);