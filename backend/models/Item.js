const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Books', 'Electronics', 'Clothing', 'Sports', 'Other']
    },
    listingType: {
        type: String,
        required: true,
        enum: ['rent', 'sell', 'barter']
    },
    // Rent ke liye
    pricePerDay: {
        type: Number,
        default: 0
    },
    // Sell ke liye
    sellPrice: {
        type: Number,
        default: 0
    },
    // Barter ke liye
    barterWant: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);