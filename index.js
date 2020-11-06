
const express     = require('express')
const mongoose    = require('mongoose')
const bodyParser  = require('body-parser')
const path        = require('path')
const helmet      = require('helmet')
const cors        = require('cors')
const ccxws       = require("ccxws");
const socketUsers = require('socket.io.users');
let tradeData     = {}
const binance     = new ccxws.Binance();
                    require('dotenv').config()



/* Middleware */


 /* Modules */


/* Routes */
const registrationRoutes = require('./routes/auth/registration')
const loginRoutes = require('./routes/auth/login')
const resetRoutes = require('./routes/auth/reset')

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
      socket.on('SEND_MESSAGE', function(market) {
        binance.subscribeTrades(market);
        binance.on("trade", trade => tradeData = trade)
      });
    });

    setInterval(() => {
      io.emit('MESSAGE', tradeData)
    }, 1000)

  } catch (e) {
    console.log(e)
  }
}

start()





