
const express     = require('express')
const mongoose    = require('mongoose')
const bodyParser  = require('body-parser')
const path        = require('path')
const helmet      = require('helmet')
const cors        = require('cors')
const ccxws       = require("ccxws");
                    require('dotenv').config()

/* Api */
const subscribeForTrades = require('./api/subscribeForTrades')
/* Modules */


/* Routes */
const registrationRoutes  = require('./routes/auth/registration')
const loginRoutes         = require('./routes/auth/login')
const resetRoutes         = require('./routes/auth/reset')
const pairs               = require('./routes/trade/pairs')
const getChartData        = require('./routes/trade/getChartData')
const createDeal          = require('./routes/deals/createDeal')
const checkAuth           = require('./routes/auth/checkAuth')
const updateBalance       = require('./routes/user/updateBalance')
const getDeals            = require('./routes/deals/getDeals')
const updateDeal          = require('./routes/deals/updateDeal')
const getCandleData       = require('./routes/trade/getCandleData')


/* Application initialization */
const app = express()

/* For access to public files */
app.use(express.static(path.join(__dirname, 'public')))

/* Parse incoming requests */
app.use(bodyParser.urlencoded({ extended: false })) // x-www-urlencoded
app.use(bodyParser.json()) // json

app.use(helmet())

/* Use middleware */
app.use(cors())

/* Use Routes */
app.use('/api', registrationRoutes)
app.use('/api', loginRoutes)
app.use('/api', resetRoutes)
app.use('/api', pairs)
app.use('/api', getChartData)
app.use('/api', createDeal)
app.use('/api', checkAuth)
app.use('/api', updateBalance)
app.use('/api', getDeals)
app.use('/api', updateDeal)
app.use('/api', getCandleData)


// Error middleware after all routes
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err)
    res.status(401).send(err);
  }
  else {
    next(err);
  }
});


async function start() {
  try {
    await mongoose.connect('mongodb+srv://emil:emil1111@cluster0.e1kvc.mongodb.net/traiding', {
      useUnifiedTopology: true, 
      useNewUrlParser: true,
      useFindAndModify: false
    })
    const server      = app.listen(3000)
          io          = require('socket.io')(server);
    
    io.on('connection', function(socket){
      const binance     = new ccxws.Binance()
      let userId = socket.handshake.query.userID

      let currMarket    = null
      let socketConnection = socket.id
      let tradeData     = {
        candle: null,
        line: null
      }

      socket.on('SEND_MESSAGE', async function(market) {
        if (!currMarket) {
          currMarket = market
          binance.subscribeTrades(currMarket)
          binance.subscribeCandles(currMarket)

          binance.on("trade", trade => tradeData.line = trade)
          binance.on("candle", candle => tradeData.candle = candle)

        }else if (currMarket.id !== market.id) {
          binance.unsubscribeTrades(currMarket)
          binance.unsubscribeCandles(currMarket)
          tradeData.line = null
          tradeData.candle = null

          currMarket = market
          binance.subscribeTrades(currMarket)
          binance.subscribeCandles(currMarket)

          binance.on("trade", trade => tradeData.line = trade)
          binance.on("candle", candle => tradeData.candle = candle)
        }

        setInterval(() => {
          if (tradeData.line) {
            io.to(socketConnection).emit('MESSAGE_TRADE', tradeData.line)
          }
          if (tradeData.candle) {
            io.to(socketConnection).emit('MESSAGE_CANDLE', tradeData.candle)
          }
        }, 2000)
      });

    });

  } catch (e) {
    console.log(e)
  }
}

start()
subscribeForTrades()







