var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var bcrypt = require('bcrypt');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('cookie-session')


var config;
if (app.get('env') === 'production') {
    config = require('./config/configProd.js');
} else {
    config = require('./config/configDev.js');
}

var Cloudant = require('./config/cloudant').initialize(config);
Cloudant.testDbConnection();


//passport setup
var passport = require('./config/passport')(config, Cloudant.dbConnection());


//config

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.NOTEABLE_SECRET_KEY,
}));
app.use(passport.initialize());
app.use(passport.session());



require('./routes/routes.js')(app, passport);


module.exports = app;
