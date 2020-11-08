
const express     = require('express')
const mongoose    = require('mongoose')
const bodyParser  = require('body-parser')
const path        = require('path')
const helmet      = require('helmet')
const cors        = require('cors')
const ccxws       = require("ccxws");
let currMarket     = null
const socketUsers = require('socket.io.users');
                    require('dotenv').config()

/* Middleware */
const addTradeToDb = require('./middleware/addNewRecords')
const deleteOldRecords = require('./middleware/deleteOldRecords')


 /* Modules */


/* Routes */
const registrationRoutes = require('./routes/auth/registration')
const loginRoutes = require('./routes/auth/login')
const resetRoutes = require('./routes/auth/reset')
const pairs = require('./routes/trade/pairs')
const getChartData = require('./routes/trade/getChartData')

/* Application initialization */
const app = express()

socketUsers.Session(app)

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
    let tradeData     = null
    const binance     = new ccxws.Binance()
    await mongoose.connect('mongodb+srv://emil:emil1111@cluster0.e1kvc.mongodb.net/traiding', {
      useUnifiedTopology: true, 
      useNewUrlParser: true,
      useFindAndModify: false
    })
    
    const server    = app.listen(3000)
          io        = require('socket.io')(server);
          rootUsers = socketUsers.Users

    io.use(socketUsers.Middleware());

    rootUsers.on('connected', function(user){
      console.log('User has connected with ID: '+ user.id);
    });
    
    rootUsers.on('disconnected',function(user){
      console.log('User with ID: '+user.id+'is gone away :(');
    });
    
    io.on('connection', function(socket){

      socket.on('SEND_MESSAGE', async function(market) {
        if (!currMarket) {
          currMarket = market
          await binance.subscribeTrades(currMarket);
          await binance.on("trade", trade => tradeData = trade)
        } else if (currMarket.id === market.id){
        } else if (currMarket.id !== market.id) {
          tradeData = null
          await binance.unsubscribeTrades(currMarket);
          currMarket = market
          await binance.subscribeTrades(currMarket);
          binance.on("trade", trade => tradeData = trade)
        }
      });

    });

    setInterval(() => {
      if (tradeData) {
        io.emit('MESSAGE', tradeData)
      }
    }, 1000)

  } catch (e) {
    console.log(e)
  }
}

start()

/* Trade options */
const options = [
  {
    id: 'LTCUSDT',
    base: 'LTC',
    quote: 'USDT'
  },
  {
    id: 'BTCUSDT',
    base: 'BTC',
    quote: 'USDT'
  },
]
async function subscribeForTrade (market, binance) {
  let tradeData
  await binance.subscribeTrades(market)
  await binance.on("trade", trade => {
    tradeData = trade
  })
  
  await setInterval(async () => {
    if (tradeData) {
      await addTradeToDb(tradeData)
    }
  }, 1000)
}

setInterval (async () => {
  await deleteOldRecords()
}, 10000)

options.forEach(async market => {
  let binance = new ccxws.Binance()
  await subscribeForTrade(market, binance)
});





