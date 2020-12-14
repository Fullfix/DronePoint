const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    placeFrom: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'cannot be blank'],
        ref: 'DronePoint',
    },
    placeTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'cannot be blank'],
        ref: 'DronePoint',
    },
    distance: {
        type: Number,
        required: [true, 'cannot be blank'],
    },
    price: {
        type: Number,
        required: [true, 'cannot be blank'],
    },
    state: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
    },
});

module.exports = mongoose.model('Order', orderSchema);