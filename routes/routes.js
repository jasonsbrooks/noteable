module.exports = function(app, passport) {

    app.get('/', function(req, res){
        res.render('index', { 
            title: 'Noteable',
            user: req.user 
        });    });

    //auth
    app.get('/login', function(req, res){
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

    app.get('/register', function(req, res){
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

    app.get('/logout', isLoggedIn, function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/editor', isLoggedIn, function(req, res){
        res.render('editor', {
            title: 'Editor',
            user: req.user
        });
    });

    app.get('/dashboard', isLoggedIn, function(req, res){
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user
        });
    });






    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}
