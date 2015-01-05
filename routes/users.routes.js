"use strict";

var users = require('../controllers/users.controller.js');

module.exports = function(app, passport) {
    app.route('/users/:userId').get(users.read);
    app.route('/users').get(users.list).post(users.create);
    app.param('userId', users.userByID);
};
