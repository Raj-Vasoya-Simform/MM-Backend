const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    unique_id: String,
    name: String,
    qty: Number,
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',  // Assuming you have a 'categories' collection, this sets up a reference
        required: true
    },
    description: String,
    price: Number,
    taxes: Array,
    is_deleted: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' },
    versionKey: false 
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;
