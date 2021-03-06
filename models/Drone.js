const mongoose = require('mongoose');

const posValidation = (val) => val.length === 2;

const droneSchema = mongoose.Schema({
    pos: {
        type: [Number],
        validate: [posValidation, 'Position must have 2 values: lat and lng'],
    },
    sysid: {
        type: Number,
        required: true,
    },
    landed_state: {
        type: Number,
        required: true,
        default: 1,
    },
    currentDronepoint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DronePoint',
    },
});

module.exports = mongoose.model('Drone', droneSchema);