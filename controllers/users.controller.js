"use strict";

var Cloudant = require('../config/cloudant'),
    db = Cloudant.dbConnection().use('users'),
    md5 = require('MD5');

db.index({name:'userId', type:'json', index:{fields:['userId']}});

exports.create = function(req, res) {
    var body = req.body;

    db.find({selector: {userId: body.userId}}, function(err, result) {
        if (err) { return next(err); }
        if (result.docs && result.docs.length > 0) {
            return next(new Error('User already exists'));
        } else {
            console.log('Creating new user: ' + JSON.stringify(body, null, '    '));
            Users.insert({
                userId:body.userId,
                password:md5(body.password)
            }, function(err) {
                if (err) { return next(err); }
                return res.status(200).json({"message":"user created successfully."});
            });
        }
    });
};

exports.update = function(req, res) {
    /* where is the cloudant api for update? */
};

exports.delete = function(req, res) {
    /* no idea how delete works either */
};

exports.list = function(req, res) {
    /* this does not return what we want... */
    db.list(function(err, body) {
        if (err) { return next(err); }
        console.log(JSON.stringify(body, null, '    '));
        return res.status(200).json({
            count: body.total_rows,
            results: body.rows
        });
    });
};

exports.read = function(req, res) {
    res.json(req.profile);
};

exports.userByID = function(req, res, next, id) {
    db.find({selector: {userId: id}}, function(err, result) {
        if (err) { return next(err); }
        if (!result.docs || result.docs.length == 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        req.profile = result.docs[0];
        next();
    });
};

/**
* Require login routing middleware
*/
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }

    next();
};
