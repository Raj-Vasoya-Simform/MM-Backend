const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    module: String,
    message: String,
    action: String,
    history_date: String,
    is_delete: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const historyModel = mongoose.model('history', historySchema);

module.exports = historyModel;
