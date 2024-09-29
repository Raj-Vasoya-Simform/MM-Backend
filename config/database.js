// db.js

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
