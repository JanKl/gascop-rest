import { CyclicAlarmWatchdog } from "./methods/CyclicAlarmWatchdog";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/indexRouter');
var v1messageRouter = require('./routes/v1/messageRouter');
var v1predefinedMessage = require('./routes/v1/predefinedMessageRouter');
var v1predefinedPager = require('./routes/v1/predefinedPagerRouter');

var app = express();

// Start cyclic alarm background job
let _cyclicAlarmWatchdog = new CyclicAlarmWatchdog();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/v1/message', v1messageRouter);
app.use('/v1/predefinedMessage', v1predefinedMessage);
app.use('/v1/predefinedPager', v1predefinedPager);

// catch 404 and forward to error handler
app.use(function(_req: any, _res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, _next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
