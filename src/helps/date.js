function date () {
    newDate = new Date();
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}T${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}${newDate.getTimezoneOffset()/60}:00`
}

module.exports = { date }