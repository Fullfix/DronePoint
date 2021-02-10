const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    tariff: {
        type: Number,
        required: [true, 'cannot be blank'],
    },
    name: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
    },
    cargoTaken: {
        type: Boolean,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    drone: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Drone',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);