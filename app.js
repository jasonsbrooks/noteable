var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    bcrypt = require('bcrypt'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    session = require('cookie-session');


module.exports = function(config, db) {
    var app = express();

    //passport setup
    var passport = require('./config/passport')(config, db);

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

    return app;
};
