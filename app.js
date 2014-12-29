var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes/index');

var app = express();

var db;
var Cloudant;
var dbCredentials = {
    dbName : 'noteable'
};


//cloudant setup
function initDBConnection() {
    if (app.get('env') === 'development') {
        dbCredentials.host = process.env.cloudantHost;
        dbCredentials.port = process.env.cloudantPort;
        dbCredentials.user = process.env.cloudantUsername;
        dbCredentials.password = process.env.cloudantPassword;
        dbCredentials.url = process.env.cloudantURL;
    } else {
        if(process.env.VCAP_SERVICES) {
            var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
            if(vcapServices.cloudantNoSQLDB) {
                dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
                dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
                dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
                dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
                dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
            }
            console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
        }
    }
    
    

    Cloudant = require('cloudant')(dbCredentials.url);
    
    //check if DB exists if not create
    Cloudant.db.create(dbCredentials.dbName, function (err, res) {
        if (err) { 
            console.log("Database already created");
            // console.log('could not create db ', err);
        }
    });
    db = Cloudant.use(dbCredentials.dbName);
}

initDBConnection();


//passport setup
var passport = require('passport');
require('./config/passport')(passport, Cloudant, db);

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
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
