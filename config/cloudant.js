
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
                        var admin_email = config.admin_email;
                        var index_fields = config.index_fields;
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
                                console.log(err.reason);
                            }
                        });
                    }
                });
            }
        });
};
