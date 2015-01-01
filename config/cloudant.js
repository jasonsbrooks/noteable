"use strict";
var chalk = require('chalk');

var initialized = false;
var cloudConfig = null;

var dbConnection = module.exports.dbConnection = function() {
    return require('cloudant')({
        account: cloudConfig.cloudant.user,
        password: cloudConfig.cloudant.password,
        url: cloudConfig.cloudant.url
    });
};


module.exports.testDbConnection = function(callback) {
    var connection = dbConnection();
    process.stdout.write('Testing db connection...\t');

    var next = function(err, db, didCreateDefault) {
        process.stdout.write(!!err ? chalk.red('✖\n') : chalk.green('✓\n'));
        callback(err,db,didCreateDefault);
    }

    if (!connection) {
        if (next) {
            next(new Error('Database not initialized.'), null, undefined);
        }
        return null;
    }

    connection.ping(function(er, reply) {
        if (er) {
            if (next) {
                next(er, null, undefined);
            }
            return;
        }
        else {
            //check if DB exists if not create
            connection.db.create(cloudConfig.cloudant.dbName, function (err, res) {
                if (err) {
                    if (next) {
                        next(null, connection, false);
                    }
                } else {
                    console.log('Created default db "%s"', cloudConfig.cloudant.dbName);
                    var dbname = cloudConfig.cloudant.dbName;
                    var admin_user = cloudConfig.admin_user;
                    var admin_pass = cloudConfig.admin_password;
                    var admin_email = cloudConfig.admin_email;
                    var index_fields = cloudConfig.index_fields;
                    var hash_pass = bcrypt.hashSync(admin_pass, 10);
                    var userdb = Cloudant.use(dbname);
                    userdb.insert({ username:admin_user, password:hash_pass, email: admin_email }, function(err, body) {
                        if (!err) {
                            console.log("Admin User was created!");
                            //indexes
                            var i;

                            for (i = 0; i < index_fields.length; i++) {
                                var index = {name:index_fields[i], type:'json', index:{fields:[index_fields[i]]}};
                                console.log(index);
                                userdb.index(index, function(err, body) {
                                    if (!err) {
                                        console.log("Index created!");
                                    } else {
                                        console.log(err.reason);
                                    }
                                });
                            }
                        } else {
                            console.error(err.reason);
                        }
                        if (next) {
                            next(err, connection, true);
                        }
                    });
                }
            });
        }
    });
};

module.exports.initialize = function(config) {
    process.stdout.write('Initializing database...\t');
    var s = (!!config.cloudant &&
             !!config.cloudant.user &&
             !!config.cloudant.password &&
             !!config.cloudant.url &&
             !!config.cloudant.dbName);
    console.assert(config.cloudant, chalk.red("cloudant config is not null"));
    console.assert(config.cloudant.user, chalk.red("user is not null"));
    console.assert(config.cloudant.password, chalk.red("password is not null"));
    console.assert(config.cloudant.url, chalk.red("url is not null"));
    console.assert(config.cloudant.dbName, chalk.red("dbName is not null"));

    if (s) {
        cloudConfig = config;
        initialized = true;
        process.stdout.write(chalk.green('✓\n'));
        return module.exports;
    } else {
        process.stdout.write(chalk.red('✖\n'));
    }
    return null;
};
