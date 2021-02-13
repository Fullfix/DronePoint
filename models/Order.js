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
        enum: [
            'waiting-input',
            'inserting-cargo',
            'not-started',
            'in-progress', 
            'completed', 
            'taking-cargo', 
            'putting-cargo',
            'waiting-cargo',
            'giving-cargo',
            'cargo-given',
        ],
        default: 'waiting-input',
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