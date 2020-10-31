
const express     = require('express')
const mongoose    = require('mongoose')
const bodyParser  = require('body-parser')
const path        = require('path')
const helmet      = require('helmet')
const cors        = require('cors')
const ccxws       = require("ccxws");
const binance     = new ccxws.Binance();
                    require('dotenv').config()

const market = {
  id: "BTCUSDT", // remote_id used by the exchange
  base: "BTC", // standardized base symbol for Bitcoin
  quote: "USDT", // standardized quote symbol for Tether
};


/* Middleware */
// const notFoundRequest = require('./middleware/404')


/* Routes */
const registrationRoutes = require('./routes/auth/registration')
const loginRoutes = require('./routes/auth/login')
const resetRoutes = require('./routes/auth/reset')

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

    const server = app.listen(3000)
    const io = require('socket.io')(server);

    io.on('connection', function(socket) {
      socket.on('SEND_MESSAGE', function(some) {
        console.log("start -> some", some)
        binance.subscribeTrades(market);
        // handle trade events
        binance.on("trade", trade => {
          console.log("start -> trade", trade)
          io.emit('MESSAGE', trade)
        })
      });
    });

  } catch (e) {
    console.log(e)
  }
}
start()





