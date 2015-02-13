var cloudant = require('../config/cloudant.js').dbConnection();
var uuid = require('uuid-js');
var bcrypt = require('bcrypt');
var AWS = require('aws-sdk');
var crypto = require('crypto');
var fs = require('fs');

module.exports = function(app, passport) {
    var db = cloudant.use('noteable');
    var s3 = new AWS.S3();

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
        email = req.body.email;
        password = req.body.password;
        db.find({selector:{email:email}}, function(err, result) {
            if (err){
                console.log("There was an error finding the user: " + err);
                return res.json({'success': 'false', 'code': '1'});
            }
            if (result.docs.length == 0){
                console.log("Email was not found");
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
                return res.json({'success': 'true', 'token': uuid4, 'code': '0', 'name': user.fullName});
            } else {
                console.log("Password is not correct");
                console.log(user.token);
                //err = {"reason":"Password is incorrect"};
                return res.json({'success': 'false', 'code': '2'});
            }
        })
    });

    app.post('/notes/iphone-upload', function(req, res) {
        var contents = req.files.photo.buffer;
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        hash.end()
        var fName = hash.read() + '.jpg';
        var params = {Bucket: 'noteable-paf14', Key: fName, Body: contents, ACL: 'public-read'};
        s3.putObject(params, function(err, data){
            if (err) {
                console.log('Error uploading data: ', data);
                return res.json({'success':'false'});
            } else {
                console.log('Successful upload');
                console.log('URL: http://noteable-paf14.s3.amazonaws.com/' + fName);
                return res.json({'success':'true'});
            }
        });
    });

    //for Jason to fill out
    app.get('/iphone/files', function(req, res) {
        var token = req.query.token;
        res.json({
            'success': 'true',
            'results':[
            {'name': 'file1', 'url': 'file2'},
            {'name': 'jazear', 'url': 'microsoft'}
            ]
        });
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
        db.find({selector: {type: 'note', collaborators: {$in: [req.user.email]}}}, function(err, body) {
            res.render('dashboard', {
                title: 'Dashboard',
                user: req.user,
                notes: body
            });
            console.log(body);
        })
    });

    app.get('/note/new', isLoggedIn, function(req, res) {
        console.log("New note")
        db.insert({
            type: 'note',
            name: 'Untitled document',
            owner: req.user.email,
            collaborators: [req.user.email],
            permission: 1,
            time: new Date()
        }, function(err, doc) {
            if (err) {
                console.log(err);
                res.send(500);
            } else {
                res.redirect('/edit/' + doc.id);
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
                    doc: doc,
                    shareURL: req.protocol + '://' + req.get('host') + '/edit/' + noteID + '#share'
                });
            }
        });
    });

    app.post('/edit/:noteID/save', function(req, res) {
        noteID = req.param("noteID");
        db.get(noteID, function(err, doc) {
            if (err) {
                res.json({'success':'false'});
                return;
            } else{
                doc.contents = req.body.contents;
                db.insert(doc, doc.id, function(err, doc) {
                    // there should never be an error here
                    // add stuff if there is an error later
                });
                res.json({'success':'true'});
            }
        });
    });

    app.post('/edit/:noteID/name', function(req, res) {
        noteID = req.param("noteID");
        db.get(noteID, function(err, doc) {
            if (err) {
                res.json({'success':'false'});
                return;
            } else{
                doc.name = req.body.name;
                db.insert(doc, doc.id, function(err, doc) {
                    // there should never be an error here
                    // add stuff if there is an error later
                });
                res.json({'success':'true'});
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
