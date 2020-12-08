const mongoose = require('mongoose');

const posValidation = (val) => val.length === 2;

const pointSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'cannot be blank'],
        unique: true,
    },
    pos: {
        type: [Number],
        validate: [posValidation, 'Position must have 2 values: lat and lng'],
    }
});

module.exports = mongoose.model('DronePoint', pointSchema);