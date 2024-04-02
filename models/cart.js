// Import mongoose
const mongoose = require('mongoose');

// Define schema
const userDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    selectedImages: [{
        imageUrl: {
            type: String,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    }
});

// Create model
const UserData = mongoose.model('UserData', userDataSchema);

// Export model
module.exports = UserData;