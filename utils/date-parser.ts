export function parseDate(date: Date = new Date()): string {
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    if (day.length === 1) {
        day = "0" + day;
    }
    if (month.length === 1) {
        month = "0" + month;
    }
    return year + "-" + month + "-" + day;
}

export function parseMonth(date: Date = new Date()) {
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    return month + "-" + year;
}

export function parseTime(date: Date = new Date()) {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();
    if (hours.length === 1) {
        hours = "0" + hours;
    }
    if (minutes.length === 1) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes + ":" + seconds;
}