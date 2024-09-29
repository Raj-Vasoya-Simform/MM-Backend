const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    status: String,
    is_delete: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
