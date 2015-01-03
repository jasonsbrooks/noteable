var cloudant = require('../config/cloudant.js').dbConnection();

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

    app.get('/editor', isLoggedIn, function(req, res) {
        res.render('editor', {
            title: 'Editor',
            user: req.user
        });
    });

    app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user
        });
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

    app.get('/api/list', isLoggedIn, function(req, res) {

        db.find({selector: {type: 'note', collaborators: {$in: [req.user.username]}}}, function(err, body) {
            res.json(err || body);
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




    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}
