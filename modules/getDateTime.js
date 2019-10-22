var moment = require('moment-timezone');
var rp = require('request-promise');

function getLivePrice() {
    return "good"

}

exports.livePrice = function() {
    rp('https://api.huobi.pro/market/trade?symbol=btcusdt')
        .then(function(htmlString) {
            // Process html...
            console.log(htmlString)
            return htmlString
        })
        .catch(function(err) {
            // Crawling failed...
        });

}

exports.myDateTime = function() {

    let m5LoopChina = "close"
    let m5LoopUsa = "close"
    let m5LoopCyto = ""
        // get time zone
    let cnZone = moment().tz("Asia/Shanghai")
    let usZone = moment().tz("America/New_York")
        // get time by format
    let cnTime = cnZone.format('HH:mm:ss')
    let usTime = usZone.format('HH:mm:ss')
        // get day of week should return number
    let cnDay = cnZone.day()
    let usDay = usZone.day()

    // check time to set stock status "market close or not"

    //china stocks close on saturday and sunday
    // and time open is 09:25 to 11:25; 13:00 to 14:57
    let format = 'HH:mm:ss'
    let beforeTime1 = moment('09:30:03', format)
    let afterTime1 = moment('11:30:03', format)
    let beforeTime2 = moment('13:00:03', format)
    let afterTime2 = moment('15:00:03', format)
    const checkTime1 = moment(cnTime, format).isBetween(beforeTime1, afterTime1)
    const checkTime2 = moment(cnTime, format).isBetween(beforeTime2, afterTime2)
    if (cnDay <= 5 && (checkTime1 || checkTime2)) {
        m5LoopChina = parseInt(moment().format('mm')[1]) >= 5 ? ((10 - parseInt(moment().format('mm')[1])) * 60) - moment().format('ss') : ((5 - parseInt(moment().format('mm')[1])) * 60) - moment().format('ss')
    }
    // us index doolar stock close on saturday and sunday
    if (usDay <= 5) {
        m5LoopUsa = parseInt(moment().format('mm')[1]) >= 5 ? ((10 - parseInt(moment().format('mm')[1])) * 60) - moment().format('ss') : ((5 - parseInt(moment().format('mm')[1])) * 60) - moment().format('ss')

    }
    m5LoopCyto = parseInt(moment().format('mm')[1]) >= 5 ? ((10 - parseInt(moment().format('mm')[1])) * 60) - moment().format('ss') : ((5 - parseInt(moment().format('mm')[1])) * 60) - moment().format('ss')


    let time = {
        usindex: {
            now: usTime,
            timer: m5LoopUsa

        },
        btc1: {
            now: usTime,
            timer: 60 - moment().format('ss')
        },
        btc5: {
            now: usTime,
            timer: m5LoopCyto
        },
        SH000001: {
            now: cnTime,
            timer: m5LoopChina
        },
        SZ399001: {
            now: cnTime,
            timer: m5LoopChina
        },
        SZ399415: {
            now: cnTime,
            timer: m5LoopChina
        },
        SH00300: {
            now: cnTime,
            timer: m5LoopChina
        }
    }
    return time
}