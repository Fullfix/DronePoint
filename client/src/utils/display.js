export const formattedTime = (s) => {
    if (s < 60) return `${parseInt(s)} сек`
    if (s < 60 * 60) return `${parseInt(s / 60)} минут`
    if (s < 60 * 60 * 24) return `${parseInt(s / (60 * 60))} часов`
    return `${parseInt(s / (60 * 60 * 24))} дней`
}