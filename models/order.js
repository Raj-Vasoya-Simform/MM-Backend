const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    gstNoSupplier: String,
    idMarks: String,
    description: String,
    status: String,
    order_no: String,
    quantity: Number,
    cgstAmount: Number,
    rofCgst: Number,
    calCgst: Number,
    sgstAmount: Number,
    rofSgst: Number,
    calSgst: Number,
    igstAmount: Number,
    rofIgst: Number,
    calIgst: Number,
    trafficClassification: String,
    order_date: Date,
    natureOfProcessing: String,
    address: String,
    duration: Number,
    is_deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' }, versionKey: false });

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;
