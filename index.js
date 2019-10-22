const express = require('express')
var rp = require('request-promise');

const app = express()
const PORT = process.env.PORT || 5000

const mio = require('./socket')

// my modules
var dt = require('./modules/getDateTime');

let liveprice = {
    btc1: {

    },
    usindex: {

    },
    btc5: {

    },
    SH000001: {

    },
    SZ399001: {

    },
    SZ399415: {

    },
    SH00300: {

    }
}

let url = [{
        url: 'http://hq.sinajs.cn/rn=1553570744061list=DINIW',
        name: 'usindex'
    },
    {
        url: 'https://hq.sinajs.cn/?rn=1552280540946&list=sh000001',
        name: 'SH000001'
    },
    {
        url: 'https://hq.sinajs.cn/etag.php?_=1553569520963&list=sz399001',
        name: 'SZ399001'
    },
    {
        url: 'https://hq.sinajs.cn/etag.php?_=1553569520963&list=sz399415',
        name: 'SZ399415'
    },
    {
        url: 'https://hq.sinajs.cn/etag.php?_=1553569520963&list=sh000300',
        name: 'SH00300'
    }
]


app.get('/', (req, res) => {
    res.send(dt.myDateTime())
})
app.get('/liveprice', (req, res) => {
    res.status(200).json(liveprice)
})
const server = app.listen(PORT, () => {
    let timer = 59
    livePricebtc()
    for (let i = 0; i < url.length; i++) {
        livePrice(url[i].url, url[i].name)
    }

    console.log(`Node app listening on port ${PORT}!`)
    const io = require('./socket').init(server)
    io.on('connection', socket => {
        console.log('client connected')
    })
    setInterval(function(str1, str2) {
        mio.getIO().emit('time', dt.myDateTime())
        mio.getIO().emit('liveprice', liveprice)
        console.log(liveprice)
    }, 1000);
})


function livePrice(url, name) {
    let currentPrice = 0
    let previousPrice = 0
    setInterval(() => {
        rp(url, {
                json: true
            })
            .then(function(htmlString) {
                // Process html...
                // console.log(htmlString)
                // var res = htmlString.toString().split(",");
                const rs = htmlString.toString().split(",");

                currentPrice = rs[2]
                let data = {
                    currentPrice: currentPrice,
                    previousPrice: previousPrice
                }
                liveprice[name] = data
                previousPrice = currentPrice
                console.log(liveprice[name])
            })
            .catch(function(err) {
                // Crawling failed...
                console.log(err)
            });
    }, 5000)
}

function livePricebtc() {
    let currentPrice = 0
    let previousPrice = 0
    setInterval(() => {
        rp('https://api.huobi.pro/market/trade?symbol=btcusdt', {
                json: true
            })
            .then(function(res) {
                // Process html...
                // console.log(htmlString)
                // var res = htmlString.toString().split(",");
                // const rs = htmlString.toString().split(",");

                currentPrice = res.tick.data[0].price
                let data = {
                    currentPrice: currentPrice,
                    previousPrice: previousPrice
                }
                liveprice.btc1 = data
                liveprice.btc5 = data
                previousPrice = currentPrice
                console.log(liveprice.btc1)
            })
            .catch(function(err) {
                // Crawling failed...
                console.log(err)
            });
    }, 5000)
}