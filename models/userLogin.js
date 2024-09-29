const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const userLoginModel = mongoose.model('userLogin', userSchema);

module.exports = userLoginModel;
