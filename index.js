
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
const createWithdrawal    = require('./routes/withdrawals/createWithdrawal')
const getWithdrawals      = require('./routes/withdrawals/getWithdrawals')
const merchant            = require('./routes/merchant/merchant')
const getVerifyRequest    = require('./routes/verify/getVerifyRequest')
const createVerificationRequest  = require('./routes/verify/createVerificationRequest')
const users               = require('./routes/admin/users')
const withdrawals         = require('./routes/admin/withdrawals')
const setUsersSettings    = require('./routes/admin/setUsersSettings')
const setWithdStatus      = require('./routes/admin/setWithdStatus')
const platformSettings    = require('./routes/admin/platformSettings')
const setNewSettings      = require('./routes/admin/setNewSettings')
const imageUpload         = require('./routes/verify/imageUpload')
const setVReqStatus        = require('./routes/admin/setVReqStatus')
const createReferralConnection        = require('./routes/referral/createReferralConnection')
const searchUsers         = require('./routes/admin/searchUsers')


/* Application initialization */
const app = express()

/* For access to public files */
app.use(express.static(path.join(__dirname, 'public')))


/* Parse incoming requests */
app.use(bodyParser.urlencoded({ extended: false })) // x-www-urlencoded
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}))
app.use(bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoded' }))


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
app.use('/api', createWithdrawal)
app.use('/api', getWithdrawals)
app.use('/api', merchant)
app.use('/api', createVerificationRequest)
app.use('/api', getVerifyRequest)
app.use('/api', users)
app.use('/api', setUsersSettings)
app.use('/api', withdrawals)
app.use('/api', setWithdStatus)
app.use('/api', platformSettings)
app.use('/api', setNewSettings)
app.use('/api', imageUpload)
app.use('/api', setVReqStatus)
app.use('/api', createReferralConnection)
app.use('/api', searchUsers)


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
          tradeData.line = null
          tradeData.candle = null
          binance.unsubscribeTrades(currMarket)
          binance.unsubscribeCandles(currMarket)

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







