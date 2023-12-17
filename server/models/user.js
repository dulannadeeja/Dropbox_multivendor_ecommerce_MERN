const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    isActivated: { type: Boolean, default: false },
    isSeller: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: false, default: null },
    addresses: [
        {
            name: { type: String, required: true },
            apartment: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);