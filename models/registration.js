const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    email: String,
    gstNumber: String,
    password: String,
    confirmPassword: String,
    role: {
        type: String,
        default: 'admin'
    }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const registerModel = mongoose.model('register', registerSchema);

module.exports = registerModel;
