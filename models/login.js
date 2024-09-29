const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    gstNumber: String,
    password: String,
    api_token: String,
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const loginModel = mongoose.model('login', loginSchema);

module.exports = loginModel;
