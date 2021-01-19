export const formattedTime = (s) => {
    if (s < 60) return `${parseInt(s)} сек`
    if (s < 60 * 60) return `${parseInt(s / 60)} минут`
    if (s < 60 * 60 * 24) return `${parseInt(s / (60 * 60))} часов`
    return `${parseInt(s / (60 * 60 * 24))} дней`
}

export const statusToText = {
    "not-started": { text: "Ещё не началась", color: "#365EE7" },
    "in-progress": { text: "В процессе", color: "#696969" },
    "completed": { text: "Заказ доставлен", color: "#3AB665" },
}

export const tariffToText = {
    "100": "Обычный",
    "150": "Быстрый",
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