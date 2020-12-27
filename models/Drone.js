const mongoose = require('mongoose');

const posValidation = (val) => val.length === 2;

const droneSchema = mongoose.Schema({
    pos: {
        type: [Number],
        validate: [posValidation, 'Position must have 2 values: lat and lng'],
    }
});

module.exports = mongoose.model('Drone', droneSchema);