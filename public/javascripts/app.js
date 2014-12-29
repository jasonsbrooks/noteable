'use strict';

var mainApp = angular.module('mainApp', [ 'ngRoute', 'mainAppControllers' ]);

mainApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        console.log("In the route controller function");
        $routeProvider.
            when('/login', {
                templateUrl: 'partial/login',
                controller: 'LoginCtrl'
            }).
            when('/register', {
                templateUrl: 'partial/register',
                controller: 'RegistrationCtrl'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }
]);

// Seperate module and controller for initializing the Cloudant data: database, admin user, and CQ Index
// var setupApp = angular.module('setupApp', [ 'setupAppControllers' ]);

var webApp = angular.module('webApp', [
    'ngRoute',
    'webAppControllers'
]);

webApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/main', {
                templateUrl: 'partial/auth/home',
                controller: 'HomeCtrl'
            }).
            otherwise({
                redirectTo: '/main'
            });
    }
]);