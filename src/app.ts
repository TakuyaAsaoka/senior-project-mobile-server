import { Request, Response } from 'express';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var favoritesRouter = require('./routes/favorites');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('src/public'));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/favorites', favoritesRouter);

// CORS対策。一旦、全許可なので要修正。
app.use((req: Request, res: Response, next: () => void) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: (err: any) => void) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: (err: any) => void) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
