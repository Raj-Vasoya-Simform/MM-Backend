// models/User.js

const mongoose = require('mongoose');

const profileShema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
  profilePicture: { type: String },
});

const Profile = mongoose.model('Profile', profileShema);

module.exports = Profile;
