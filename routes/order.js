const express = require('express');
const passport = require('passport');
const DronePoint = require('../models/DronePoint');
const Order = require('../models/Order');
require('dotenv/config');

const router = express.Router();

router.get('/all', async (req, res, next) => {
    const orders = await Order.find({});
    res.data = orders;
    return next();
});

router.get('/me', passport.authenticate('jwt'), async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.data = orders;
    return next();
});

router.get('/by-id/:id', async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.data = { err: 'Order with this id does not exist', status: 404 };
        return next();
    }
    res.data = order;
    return next();
});

router.post('/create/auth', passport.authenticate('jwt'), async (req, res, next) => {
    const placeFrom = await DronePoint.findById(req.body.placeFrom);
    const placeTo = await DronePoint.findById(req.body.placeTo);
    if (!placeFrom) {
        res.data = { err: "Invalid placeFrom: Drone point doesn't exist" };
        return next();
    }
    if (!placeTo) {
        res.data = { err: "Invalid placeTo: Drone point doesn't exist" };
        return next();
    }
    const order = new Order({
        placeFrom: placeFrom._id,
        placeTo: placeTo._id,
        distance: 100,
        price: 100,
        user: req.user._id,
    });
    const newOrder = await order.save();
    res.data = newOrder;
    return next();
});

router.post('/create/guest', async (req, res, next) => {
    const placeFrom = await DronePoint.findById(req.body.placeFrom);
    const placeTo = await DronePoint.findById(req.body.placeTo);
    if (!placeFrom) {
        res.data = { err: "Invalid placeFrom: Drone point doesn't exist" };
        return next();
    }
    if (!placeTo) {
        res.data = { err: "Invalid placeTo: Drone point doesn't exist" };
        return next();
    }
    const order = new Order({
        placeFrom: placeFrom._id,
        placeTo: placeTo._id,
        distance: 100,
        price: 100,
    });
    const newOrder = await order.save();
    res.data = newOrder;
    return next();
});

module.exports = router;