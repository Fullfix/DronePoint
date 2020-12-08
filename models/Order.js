const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    placeFrom: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'cannot be blank'],
    },
    placeTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'cannot be blank'],
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
        enum: ['not-started', 'in-progress', 'completed']
    }
});

module.exports = mongoose.model('Order', orderSchema);