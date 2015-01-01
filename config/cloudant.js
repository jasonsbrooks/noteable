
var config = null;


module.exports.initialize = function(config) {
    var Cloudant = require('cloudant')({
        account: config.cloudant.user,
        password: config.cloudant.password,
        url: config.cloudant.url
    });

    testDbConnection(config.dbName);
};

var testDbConnection = module.exports.testDbConnection = function() {
    Cloudant.ping(function(err, reply) {
        if (err) {
            console.log('Failed to ping Cloudant. Did the network just go down?');
        }
        else {
            console.log('Cloudant connection was successful');

            //check if DB exists if not create
            Cloudant.db.create(config.dbName, function (err, res) {
                if (err) {
                    console.log("Database already created");
                } else {
                    console.log("Created Noteable");
                    var hash_pass = bcrypt.hashSync(config.admin_password, 10);

                    var db = Cloudant.use(config.dbname);
                    db.insert({ username:config.admin_user, password:hash_pass }, function(err, body) {
                        if (!err) {
                            console.log("Admin User was created!");
                            var username_idx = {name:'username', type:'json', index:{fields:[config.index_field]}};
                            db.index(username_idx, function(err, body) {
                                if (!err) {
                                    console.log("Index " + index_field + " was created!");
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
};
