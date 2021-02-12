
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
const calculateLoseDeal  = require('./middleware/calculateLoseDeal')
const getLimitTradesData  = require('./api/getLimitTradesData')
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
const getPartnerByUser    = require('./routes/referral/getPartnerByUser')
const getReferralsByUser  = require('./routes/referral/getReferralsByUser')
const getPartners         = require('./routes/referral/getPartners')
const setPercentToPartner = require('./routes/referral/setPercentToPartner')
const getPromocodes       = require('./routes/promocodes/getPromocodes')
const createPromocodes    = require('./routes/promocodes/createPromocodes')
const checkPromocode      = require('./routes/promocodes/checkPromocode')
const deactivatePromocode = require('./routes/promocodes/deactivatePromocode')
const getDeposits         = require('./routes/deposit/getDeposits')
const getCryptoAddress    = require('./routes/cryptoDep/getCryptoAddress')
const getLastPrice        = require('./routes/trade/getLastPrice')
const watchForBalance     = require('./routes/cryptoDep/watchForBalance')
const getCurrentPriceForTransaction = require('./routes/cryptoDep/getCurrentPriceForTransaction')

/* Application initialization */
const app = express()

/* For access to public files */
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
/* Parse incoming requests */
app.use(bodyParser.urlencoded({ extended: false })) // x-www-urlencoded

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
app.use('/api', getPartnerByUser)
app.use('/api', getReferralsByUser)
app.use('/api', getPartners)
app.use('/api', setPercentToPartner)
app.use('/api', getPromocodes)
app.use('/api', createPromocodes)
app.use('/api', checkPromocode)
app.use('/api', deactivatePromocode)
app.use('/api', getDeposits)
app.use('/api', getCryptoAddress)
app.use('/api', getLastPrice)
app.use('/api', getCurrentPriceForTransaction)
app.use('/api', watchForBalance)

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
      const binance   = new ccxws.Binance()
      let currMarket  = null
      let socketConnection = socket.id
      let tradeData   = {
        candle: [],
        line: []
      }

      let controlData = {
        price: null,
        trend: null
      }

      let middleWareTradeData = null
      let middleWareCandleData = null


      setInterval(() => {
        if (middleWareTradeData) {
          tradeData.line.push({
            ...middleWareTradeData,
            unix: new Date().setMinutes(new Date().getMinutes() + 1)
          })
        }
        if (middleWareCandleData) {
          tradeData.candle.push({
            ...middleWareCandleData,
            t: new Date().setMinutes(new Date().getMinutes() + 1)
          })
        }
      }, 2000)

  
      socket.on('SEND_CONTROL_COMAND', async function ({price, trend}) {
        controlData = {price, trend}
      })
      socket.on('CLOSE_CONTROL_COMAND', async function () {
        controlData = {price: null, trend: null}
      })
      socket.on('SEND_MESSAGE', async function(market) {
        if (!currMarket) {
          const lastMinuteTradeData = await getLimitTradesData(market.base)
          tradeData.line = lastMinuteTradeData.lineData
          tradeData.candle = lastMinuteTradeData.candleData

          currMarket = market
          binance.subscribeTrades(currMarket)
          binance.subscribeCandles(currMarket)
          

          binance.on("trade",  trade => middleWareTradeData = trade)
          binance.on("candle", candle => middleWareCandleData = candle)

        }else if (currMarket.id !== market.id) {
          binance.unsubscribeTrades(currMarket)
          binance.unsubscribeCandles(currMarket)
          middleWareTradeData = null
          middleWareCandleData = null
          tradeData.line = []
          tradeData.candle = []

          currMarket = market
          const lastMinuteTradeData = await getLimitTradesData(currMarket.base)
          tradeData.line = lastMinuteTradeData.lineData
          tradeData.candle = lastMinuteTradeData.candleData
          
          binance.subscribeTrades(currMarket)
          binance.subscribeCandles(currMarket)
          

          binance.on("trade",  trade => middleWareTradeData = trade)
          binance.on("candle", candle => middleWareCandleData = candle)

        }
      });
      
      setInterval(function() {
        if (tradeData.line[0]) {
          if (controlData.price) {
            io.to(socketConnection).emit('MESSAGE_TRADE', {
              ...tradeData.line[0],
              price: calculateLoseDeal(+tradeData.line[0].price, controlData.price, controlData.trend)
            })
          } else {
            io.to(socketConnection).emit('MESSAGE_TRADE', tradeData.line[0])
          }
        }
        if (tradeData.candle[0]) {
          io.to(socketConnection).emit('MESSAGE_CANDLE', tradeData.candle[0])
        }
        tradeData.line.shift()
        tradeData.candle.shift() 
      }, 2000)
    });

  } catch (e) {
    console.log(e)
  }
}

start()
subscribeForTrades()







