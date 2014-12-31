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
//passport setup
var passport = require('passport');
require('./config/passport')(passport, config);

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
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(session({
  secret: process.env.NOTEABLE_SECRET_KEY,
}));
app.use(passport.initialize());
app.use(passport.session());



require('./routes/routes.js')(app, passport);


//test cloudant connection
function initDBConnection() {
    var Cloudant = require('cloudant')({account:config.cloudant.user, password:config.cloudant.password});
    Cloudant.ping(function(er, reply) {
        if (er)
            return console.log('Failed to ping Cloudant. Did the network just go down?');
        else {
            console.log('Cloudant connection was successful');

            //check if DB exists if not create
            Cloudant.db.create(config.cloudant.dbName, function (err, res) {
                if (err) { 
                    console.log("Database already created");
                } else {
                    console.log("Created Noteable");
                    var dbname = config.cloudant.dbName;
                    var admin_user = config.admin_user;
                    var admin_pass = config.admin_password;
                    var index_field = config.index_field;
                    var hash_pass = bcrypt.hashSync(admin_pass, 10);
                    var userdb = Cloudant.use(dbname);
                    userdb.insert({ username:admin_user, password:hash_pass }, function(err, body) {
                        if (!err) {
                            console.log("Admin User was created!");
                            var username_idx = {name:'username', type:'json', index:{fields:[index_field]}};
                            userdb.index(username_idx, function(err, body) {
                                if (!err) {
                                    console.log("Index " +index_field+ " was created!");
                                } else {
                                    console.log(err.reason);

                                }
                            });
                        } else {
                            console.log(err.reason);

                        }
                    });
                }
            });
        }
    });
}

initDBConnection();

module.exports = app;
