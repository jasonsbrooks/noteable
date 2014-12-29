// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport, Cloudant, db) {
    // var config = require('./config.js');
    
    // var Cloudant = require('cloudant')({account:config.cloudant.account, password:config.cloudant.password});
    var bcrypt = require('bcrypt');
    // var dbname = config.cloudant.dbname;

    /// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        done(null, username);
    });


    passport.use('local-login',new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req,username, password, done) {
            var body = req.body;
            console.log(body)

            // Use Cloudant query to find the user just based on user name
            // var db = Cloudant.use(dbname);
            db.find({selector:{username:username}}, function(err, result) {
                if (err){
                    console.log("There was an error finding the user: " + err);
                    return done(null, false, { message : "There was an error connecting to the database" } );
                } 
                if (result.docs.length == 0){
                    console.log("Username was not found");
                    return done(null, false, { message : "Username was not found" } );
                }

                // user was found, now determine if password matches
                var user = result.docs[0];
                if (bcrypt.compareSync(password, user.password)) {
                    console.log("Password matches");
                     // all is well, return successful user
                    return done(null, user);
                } else {
                    console.log("Password is not correct");
                    //err = {"reason":"Password is incorrect"};
                    return done(null, false, { message :"Password is incorrect"} );
                }                
            })
        }
    ));

    passport.use('local-signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username , password, done) {
            var body = req.body;
            console.log(body);

           // Use Cloudant query to find the user just based on user name
            var db = Cloudant.use(dbname);
            db.find({selector:{username:username}}, function(err, result) {
                if (err){
                    console.log("There was an error registering the user: " + err);
                    return done(null, false, { message : "There was an error connecting to Cloudant" } );
                } 
                else if (result.docs.length > 0){
                    console.log("Username was found");
                    return done(null, false, { message : "This username already exists. Choose a different username." } );
                }

                // create the new user
                var hash_pass = bcrypt.hashSync(password, 10);
                var user = { username:username, password:hash_pass };
                console.log("Register User: " + user);
                db.insert(user, function(err, body) {
                    if (err){
                        console.log("There was an error registering the user: " + err);
                        return done(null, false, { message : "There was a problem inserting the new user into Cloudant" } );
                    } else {
                        // successful creation of the user
                        return done(null, user);
                    }
                })
            })
        }
    ));

}
