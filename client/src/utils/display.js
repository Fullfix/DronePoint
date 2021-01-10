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