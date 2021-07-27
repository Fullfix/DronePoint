const express = require('express');
const passport = require('passport');
const Drone = require('../models/Drone');
const DronePoint = require('../models/DronePoint');
const Order = require('../models/Order');
const { getOrderQueue, getTimeLeft, calcCrow, droneVelocity } = require('../services/order');
const jsonDist = require('../distances.json');
require('dotenv/config');

const router = express.Router();

router.get('/me', passport.authenticate('jwt'), async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).populate('placeTo')
    .populate('placeFrom').populate('user');
    res.data = orders;
    return next();
});

router.get('/by-id/:id', async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('placeTo')
    .populate('placeFrom').populate('user').populate('drone');
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
    // if (!req.body.price) {
    //     res.data = { err: "Invalid price" };
    //     return next();
    // }
    // if (!req.body.distance) {
    //     res.data = { err: "Invalid distance" };
    //     return next();
    // }
    if (!req.body.tariff || ![69, 80, 130].includes(req.body.tariff)) {
        res.data = { err: "Tariff missing" };
        return next();
    }
    if (calcCrow(placeFrom.pos, placeTo.pos) >= 6) {
        res.data = { err: 'Too long distance' };
        return next();
    }
    const distance = jsonDist[placeFrom.name][placeTo.name];
    const price = parseInt(distance * req.body.tariff)
    const drone = await Drone.findOne();
    const order = new Order({
        placeFrom: placeFrom._id,
        placeTo: placeTo._id,
        distance: distance,
        price: price,
        user: req.user._id,
        drone: drone._id,
        tariff: req.body.tariff,
        name: req.body.name,
    });
    const newOrder = await order.save();
    res.data = newOrder;
    return next();
});

router.post('/gettimeleft', async (req, res, next) => {
    const drone = await Drone.findOne();
    const placeFrom = await DronePoint.findById(req.body.placeFrom);
    const placeTo = await DronePoint.findById(req.body.placeTo);
    const placeCur = await DronePoint.findById(drone.currentDronepoint);
    const dist = jsonDist[placeFrom.name][placeTo.name];
    res.data = {
        distance: dist,
        time: dist * 1000 / droneVelocity,
    }
    return next();
})

router.get('/gettimeleft/:id', async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('drone')
    .populate('placeFrom').populate('placeTo');
    if (!order) {
        res.data = { err: 'Invalid Order ID' };
        return next();
    }
    if (order.state !== 'not-started') {
        res.data = getTimeLeft(order);
        return next();
    }
    const orders = await getOrderQueue();
    let timeLeft = 0;
    for (const order2 of orders) {
        timeLeft += getTimeLeft(order2);
        if (order2._id.toString() === order._id.toString()) break;
    }
    res.data = timeLeft;
    return next();
});

router.post('/insertcargo/:id', async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.data = { err: 'Invalid Order ID' };
        return next();
    }
    order.state = 'inserting-cargo';
    await order.save();
    res.data = order;
    return next();
});

router.post('/givecargo/:id', async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.data = { err: 'Invalid Order ID' };
        return next();
    }
    order.state = 'giving-cargo';
    await order.save();
    res.data = order;
    return next();
});

router.post('/returncargo/:id', async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.data = { err: 'Invalid Order ID' };
        return next();
    }
    order.state = 'completed';
    await order.save();
    res.data = order;
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
    // if (!req.body.price) {
    //     res.data = { err: "Invalid price" };
    //     return next();
    // }
    // if (!req.body.distance) {
    //     res.data = { err: "Invalid distance" };
    //     return next();
    // }
    if (!req.body.tariff || ![69, 59, 109].includes(req.body.tariff)) {
        res.data = { err: "Tariff missing" };
        return next();
    }
    if (calcCrow(placeFrom.pos, placeTo.pos) >= 6) {
        res.data = { err: 'Too long distance' };
        return next();
    }
    const distance = jsonDist[placeFrom.name][placeTo.name];
    const price = parseInt(distance * req.body.tariff)
    const drone = await Drone.findOne();
    const order = new Order({
        placeFrom: placeFrom._id,
        placeTo: placeTo._id,
        distance: distance,
        price: price,
        drone: drone._id,
        tariff: req.body.tariff,
    });
    const newOrder = await order.save();
    res.data = newOrder;
    return next();
});

// router.post('/action', async (req, res, next) => {
//     const drone = await Drone.findById(req.body.id);
//     if (!drone) {
//         res.data = { err: "Drone with this id doesn't exist" }
//         return next();
//     }
//     const order = await Order.findById(req.body.orderId);
//     if (!order) {
//         res.data = { err: "Order with this id doesn't exist" }
//         return next()
//     }
//     const newDrone = await Drone.updateOne({ _id: req.body.id }, { '$set': { 
//         action: 'order',
//         order: order._id,
//     }});
//     res.data = newDrone || 'ok';
//     return next();
// })

module.exports = router;