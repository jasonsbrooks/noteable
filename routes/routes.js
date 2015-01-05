var cloudant = require('../config/cloudant.js').dbConnection();
var uuid = require('uuid-js');
var bcrypt = require('bcrypt');

module.exports = function(app, passport) {
    var db = cloudant.use('noteable');

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'Noteable',
            user: req.user
        });    });

    //auth
    app.get('/login', function(req, res) {
        res.render('login', { title: 'Login' });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err || !user) {
                return res.redirect('/login');
            } else {
                console.log(user)
                req.logIn(user, function(err) {
                    if (err) {
                        return res.redirect('/login');
                    } else {
                        return res.redirect('/dashboard')
                    }
                })
            }
        })(req, res, next);

    });

    app.post('/iphone-login', function(req, res) {
        email = req.body.username;
        password = req.body.password;
        db.find({selector:{username:email}}, function(err, result) {
            if (err){
                console.log("There was an error finding the user: " + err);
                return res.json({'success': 'false', 'code': '1'});
            }
            if (result.docs.length == 0){
                console.log("Username was not found");
                return res.json({'success': 'false', 'code': '1'});
            }

            // user was found, now determine if password matches
            var user = result.docs[0];
            if (bcrypt.compareSync(password, user.password)) {
                console.log("Password matches");
                 // all is well, return successful user
                if (user.token) {
                    var uuid4 = user.token;
                } else {
                    var uuid4 = uuid.create().toString();
                    db.get(user._id, function(err, doc) {
                        if (!err) {
                            doc.token = uuid4;
                            db.insert(doc, doc.id, function(err, doc) {
                                // there should never be an error here
                                // add stuff if there is an error later
                            });
                        }
                    });
                }
                return res.json({'success': 'true', 'token': uuid4, 'code': '0'});
            } else {
                console.log("Password is not correct");
                console.log(user.token);
                //err = {"reason":"Password is incorrect"};
                return res.json({'success': 'false', 'code': '2'});
            }
        })
    });

    app.post('/notes/iphone-upload', function(req, res) {
        console.log(req.body);
        console.log(req.files);
        console.log(req);
        res.json({'success':'true'});
    });

    app.get('/register', function(req, res) {
        res.render('login', { title: 'Register' });
    });
    
    app.post('/register',  function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            console.log("In Passport Register Route");
            if (err || !user) {
                return res.redirect('/register');
            } else {
                console.log(user)
                req.logIn(user, function(err) {
                    if (err) {
                        return res.redirect('/register');
                    } else {
                        return res.redirect('/dashboard')
                    }
                })
            }
        })(req, res, next);
    });

    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/dashboard', isLoggedIn, function(req, res) {
        db.find({selector: {type: 'note', collaborators: {$in: [req.user.username]}}}, function(err, body) {
            res.render('dashboard', {
                title: 'Dashboard',
                user: req.user,
                notes: body
            });
            console.log(body);
        })
    });

    app.post('/note/new', isLoggedIn, function(req, res) {
        console.log("New note")
        db.insert({
            type: 'note',
            name: 'Untitled document',
            owner: req.user.username,
            collaborators: [req.user.username],
            permission: 1,
            time: Math.floor(new Date() / 1000)
        }, function(err, doc) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.send(200);
            }
            res.end();
        });
    });

    app.get('/edit/:noteID', function(req, res) {
        // use this to open a note once created
        noteID = req.param("noteID");
        db.get(noteID, function(err, doc) {
            if (err) {
                res.status(404);
                res.render('404');
                return;
            } else {
                res.render('editor', {
                    title: 'Editor',
                    user: req.user,
                    doc: doc
                });
            }
        });
    });

    // function makeIndex() {
    //     db.index({name:'type', type:'json', index:{fields:['type']}}, function(err, body) {
    //         if (!err) {
    //             console.log("Index created!");
    //         } else {
    //             console.log(err.reason);
    //         }
    //     });
    // }
    
    require('./users.routes')(app, passport);

    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}
