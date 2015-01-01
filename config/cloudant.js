"use strict";

var initialized = false;
var cloudConfig = null;

var dbConnection = module.exports.dbConnection = function() {
    return require('cloudant')({
        account: cloudConfig.cloudant.user,
        password: cloudConfig.cloudant.password,
        url: cloudConfig.cloudant.url
    });
};


module.exports.testDbConnection = function(next) {
    var connection = dbConnection();
    if (!connection) {
        if (next) {
            next(new Error('Database not initialized.'), null);
        }
        return null;
    }

    connection.ping(function(er, reply) {
        if (er) {
            if (next) {
                next(new Error('Failed to ping Cloudant. Did the network just go down?'));
            }
            return;
        }
        else {
            //check if DB exists if not create
            console.log('Checking if "%s" exists...', cloudConfig.cloudant.dbName)
            
            connection.db.create(cloudConfig.cloudant.dbName, function (err, res) {
                if (err) {
                    console.log('"%s" already exits', cloudConfig.cloudant.dbName);
                } else {
                    console.log('Created "%s"', cloudConfig.cloudant.dbName);
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
                    });
                }
                if (next) {
                    next(null);
                }
            });
        }
    });
};

module.exports.initialize = function(config) {
    console.log('Initializing database...');
    var s = (!!config.cloudant &&
             !!config.cloudant.user &&
             !!config.cloudant.password &&
             !!config.cloudant.url &&
             !!config.cloudant.dbName);
    console.assert(config.cloudant, "cloudant config is not null");
    console.assert(config.cloudant.user, "user is not null");
    console.assert(config.cloudant.password, "password is not null");
    console.assert(config.cloudant.url, "url is not null");
    console.assert(config.cloudant.dbName, "dbName is not null");

    if (s) {
        cloudConfig = config;
        initialized = true;
        console.log('Database initialized successfully.');
        return module.exports;
    } else {
        console.log('Database initialization failed.');
    }
    return null;
};
