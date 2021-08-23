
const Colors ={
    'error':"\x1b[31m",
    'warning':"\x1b[33m"
}
function log(type,message) {
    console.log(Colors[type],message)
    console.log('\x1b[0m')
}

module.exports = log;