module.exports = function(app, passport) {

    app.get('/', function(req, res){
        res.render('index', { 
            title: 'Noteable',
            user: req.user 
        });
        console.log("Session: %j", req.user);
    });

    app.get('/login', function(req, res){
        res.render('login', { title: 'Login' });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            user = req.body;
            if (err || !user) { res.status(500).json(info); }
            else {
                req.logIn(user, function(err) {
                    if (err) { res.status(500).json(err); }
                    else { res.status(200).send(); }  
                })      
            }
        })(req, res, next);
    });

    // app.get('/home', isLoggedIn, function(req, res){
    //     res.render('webapp', {
    //         title: 'Home',
    //         user: req.user
    //     });
    // });

    // app.get('/partial/auth/:name', isLoggedIn, function (req, res) {
    //     var name = req.params.name;
    //     res.render('partials/auth/' + name);
    // });

    // app.get('/partial/:name', function (req, res) {
    //     var name = req.params.name;
    //     res.render('partials/' + name);
    // });

    // app.post('/api/login',  function(req, res, next) {
    //   passport.authenticate('local-login', function(err, user, info) {
    //     console.log("In Passport Authenticate Route");
    //     if (err || !user) { res.status(500).json(info); }
    //     else {
    //         req.logIn(user, function(err) {
    //             if (err) { res.status(500).json(err); }
    //             else { res.status(200).send(); }  
    //         })      
    //     }
    //   })(req, res, next);
    // });

    // app.post('/api/register',  function(req, res, next) {
    //   passport.authenticate('local-signup', function(err, user, info) {
    //     console.log("In Passport Register Route");
    //     if (err || !user) { res.status(500).json(info); }
    //     else {
    //         req.logIn(user, function(err) {
    //             if (err) { res.status(500).json(err); }
    //             else { res.status(200).send(); }  
    //         })      
    //     }
    //   })(req, res, next);
    // });

    app.get('/logout', isLoggedIn, function(req, res){
        req.logout();
        res.redirect('/');
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