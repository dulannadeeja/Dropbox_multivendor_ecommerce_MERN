const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    addressNickname: {
        type: String
    },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
