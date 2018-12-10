var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var RateLimit = require('express-rate-limit');
const helmet = require('helmet')
var dbapi = require("./dbapi/dbapi.js")
const noSniff = require('dont-sniff-mimetype')

var indexRouter = require('./routes/index');
var blocksRouter = require('./routes/blocks');
var balanceRouter = require('./routes/balance');
var transactionRouter = require('./routes/transactions');
var assetRouter = require('./routes/asset');
var swapsRouter = require('./routes/swaps');
var fsnpriceRouter = require('./routes/fsnprice');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.enable('trust proxy'); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({
  crossdomain: false
}))
// Sets "X-Content-Type-Options: nosniff".
app.use(noSniff())

var apiLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 1000,
});
 
// only apply to requests that begin with /user/
app.use('/', apiLimiter);

// enable cor support
app.use(function(req, res, next) {
  console.log("return")
  

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Content-Type-Options, Content-Type, Accept, Authorization");
 
  
    // Pass to next layer of middleware
  next();
});

app.use('/', indexRouter)
app.use('/blocks', blocksRouter)
app.use("/balances", balanceRouter )
app.use("/transactions", transactionRouter )
app.use("/assets" , assetRouter)
app.use("/swaps", swapsRouter ) 
app.use("/fsnprice", fsnpriceRouter )


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

setTimeout( ()=> {
  console.log( (new Date())  + " Port => " + app.get('port') )
}, 5000 )

module.exports = app;