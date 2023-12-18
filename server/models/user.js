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
    defaultShippingAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: false, default: null },
    addresses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            required: false
        }
    ],
    phone: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);