var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weatherRouter = require('./routes/weather');
var forecastRouter = require('./routes/forecast');
var dailyRouter = require('./routes/daily');

var app = express();

var whitelist = ['http://localhost:3000', 'https://weather-app-itis-4340-backend-git-backend-dcadams103s-projects.vercel.app/', 'https://weather-app-itis-4340-git-backend-dcadams103s-projects.vercel.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions)); // define this middeware before the all routes as you defined.

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/weather', weatherRouter);
app.use('/forecast', forecastRouter);
app.use('/daily', dailyRouter);

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
  res.send(err.message);
  //res.render('error');
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT, function() { console.log('Server is running...'); });

module.exports = app;
