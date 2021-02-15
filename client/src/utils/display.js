export const formattedTime = (s) => {
    if (s < 60) return `${parseInt(s)} сек`
    if (s < 60 * 60) return `${parseInt(s / 60)} минут`
    if (s < 60 * 60 * 24) return `${parseInt(s / (60 * 60))} часов`
    return `${parseInt(s / (60 * 60 * 24))} дней`
}

export const statusToText = {
    "waiting-input": { text: 'Ожидает приём груза', color: '#365EE7' },
    'inserting-cargo': { text: 'Принимает груз', color: '#365EE7' },
    "not-started": { text: "Ожидает начала доставки", color: "#365EE7" },
    "taking-cargo": { text: "Забирает груз в Дрон", color: "#696969" },
    "putting-cargo": { text: "Извлекает груз из Дрона", color: "#696969" },
    "in-progress": { text: "Доставляется", color: "#696969" },
    "waiting-cargo": { text: 'Ожидает выдачи', color: '#365EE7' },
    "giving-cargo": { text: 'Выдаёт груз', color: '#365EE7' },
    "cargo-given": { text: 'Ожидает возврата контейнера', color: '#365EE7' },
    "completed": { text: "Заказ выполнен", color: "#3AB665" },
}

export const tariffToText = {
    "80": "Обычный",
    "130": "Быстрый",
    "69": "По подписке",
}

export const formattedDistance = (dist) => {
    const num = parseInt(dist)
    if (num >= 1) {
        return `${num} км`;
    }
    return `${parseInt(dist * 1000)} м`;
}

export const formattedDate = (datestring) => {
    const date = new Date(datestring);
    let dd = date.getDate();
    let mm = date.getMonth()+1; 
    const yyyy = date.getFullYear();
    if (dd<10) {
        dd='0'+dd;
    }
    if (mm<10) {
        mm='0'+mm;
    }
    return `${dd}-${mm}-${yyyy}`;
}

// Converts numeric degrees to radians
function toRad(value) {
    return value * Math.PI / 180;
}

export function calcCrow([lat1, lon1], [lat2, lon2]) {
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

export const droneVelocity = 5;

export const getDistanceLeft = (pos, p1, p2, cargoTaken) => {
    let dist;
    if (cargoTaken) {
        dist = calcCrow(pos, p2);
    } else {
        dist = calcCrow(pos, p1) + calcCrow(p1, p2);
    }
    return dist;
}

export const getTimeLeft = (order) => {
    const dist = getDistanceLeft(
        order.drone.pos,
        order.placeFrom.pos,
        order.placeTo.pos,
        order.cargoTaken,
    )
    return formattedTime(dist * 1000 / droneVelocity);
}