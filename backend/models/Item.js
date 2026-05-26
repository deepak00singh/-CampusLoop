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
    pricePerDay: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Books', 'Electronics', 'Clothing', 'Sports', 'Other']
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