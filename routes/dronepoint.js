const express = require('express');
const passport = require('passport');
const DronePoint = require('../models/DronePoint');
const Order = require('../models/Order');
require('dotenv/config');

const router = express.Router();

router.get('/all', async (req, res, next) => {
    const dronepoints = await DronePoint.find({});
    res.data = dronepoints;
    return next();
});

router.post('/create', async (req, res, next) => {
    const dronePoint = new DronePoint({
        name: req.body.name,
        pos: req.body.pos,
    });
    try {
        const newDronePoint = await dronePoint.save();
        res.data = newDronePoint;
        return next();
    } catch (err) {
        res.data = { err: err.message };
        return next();
    }
})

module.exports = router;