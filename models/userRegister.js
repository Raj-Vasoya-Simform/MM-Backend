const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
