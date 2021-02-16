const Order = require("../models/Order");

function toRad(value) {
    return value * Math.PI / 180;
}

exports.calcCrow = ([lat1, lon1], [lat2, lon2]) => {
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

const droneVelocity = 5;

exports.droneVelocity = 5;

exports.getDistanceLeft = (pos, p1, p2, cargoTaken) => {
    let dist;
    if (cargoTaken) {
        dist = this.calcCrow(pos, p2);
    } else {
        dist = this.calcCrow(pos, p1) + this.calcCrow(p1, p2);
    }
    return dist;
}

exports.getTimeLeft = (order) => {
    const dist = this.getDistanceLeft(
        order.drone.pos,
        order.placeFrom.pos,
        order.placeTo.pos,
        order.cargoTaken,
    )
    return dist * 1000 / droneVelocity;
}

exports.getOrderQueue = async () => {
    const orders = await Order.find({ state: 'not-started'})
    .populate('placeTo').populate('placeFrom').populate('drone').sort('createdAt');
    const filteredOrders = orders
    .filter(order => order.placeTo.shelf.includes(null));
    console.log(filteredOrders);
    return filteredOrders;
}