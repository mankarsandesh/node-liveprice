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
        url: 'http://127.0.0.1:8003/liveBetCount',
        name: 'liveData'
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
    
})


function livePrice(url, name) {
    let currentPrice = 0
    let previousPrice = 0
    setInterval(() => {
        rp(url, {
                json: true
            })
            .then(function(htmlString) {
              
                console.log(htmlString);
               
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
        rp('http://127.0.0.1:8003/liveBetCount', {
                json: true
            })
            .then(function(res) {
                // Process html...
                console.log(res);
            })
            .catch(function(err) {
                // Crawling failed...
                console.log(err)
            });
    }, 1000)
}