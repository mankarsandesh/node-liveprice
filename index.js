const express = require('express')
var rp = require('request-promise');

const app = express()
const PORT = process.env.PORT || 5000

const mio = require('./socket')

// my modules
var dt = require('./modules/getDateTime');

let liveprice1 = {
    data: {
    }
}
let liveprice5 = {
    data: {
    }
}

let url1 = "http://127.0.0.1:8003/liveBetCount?loop=1";
let url5 = "http://127.0.0.1:8003/liveBetCount?loop=5";
app.get('/', (req, res) => {
    res.send(liveprice1)
})
app.get('/liveprice1', (req, res) => {
    res.status(200).json(liveprice1)   
})
app.get('/liveprice5', (req, res) => {
    res.status(200).json(liveprice5)
})
const server = app.listen(PORT, () => {
        liveBetPrice1();
        liveBetPrice5();
    console.log(`Node app listening on port ${PORT}!`)
    const io = require('./socket').init(server)

    io.on('connection', socket => {
        console.log('client connected')
    })

    setInterval(function(str1, str2) {
        
        mio.getIO().emit('liveprice1', liveprice1) 
        mio.getIO().emit('liveprice5', liveprice5) 
    }, 1000);
})
function liveBetPrice1() {
    setInterval(() => {
        rp(url1, {
                json: true
            })
            .then(function(res) {
                liveprice1.data = res.data              
                // previousPrice = currentPrice
                console.log("Loop 1");
                console.log(res);
                // console.log(liveprice1.data)
                liveBetPrice1.data = res.data;
            })
            .catch(function(err) {
                // Crawling failed...                
                console.log(err)
            });
    }, 5000)
}

function liveBetPrice5() {
    setInterval(() => {
        rp(url5, {
                json: true
            })
            .then(function(res) {
                liveprice5.data = res.data              
                
                liveBetPrice5.data = res.data;
                console.log(l);
               
            })
            .catch(function(err) {
                // Crawling failed...
                console.log(err)
            });
    }, 5000)
}

