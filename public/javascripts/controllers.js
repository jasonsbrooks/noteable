'use strict';

        
/* main App Controllers */
 
var mainAppControllers = angular.module('mainAppControllers', [ 'angular-flash.service', 'angular-flash.flash-alert-directive' ])
                                .config(function (flashProvider) {
                                    // Support bootstrap 3.0 "alert-danger" class with error flash types
                                    flashProvider.errorClassnames.push('alert-danger');
                                });

mainAppControllers.controller('LoginCtrl', ['$scope', '$http','$window','$location', 'flash',
    function ($scope, $http, $window, flash) {

        console.log("In Login Controller");
        $scope.failed_login = "";

        $scope.login = function()
        {
            $scope.$parent.failed_login = "";
            console.log("In the Login Submit")
            var user = {"username": $scope.username, "password": $scope.password};
            console.log(user);
            
            if($scope.username!==undefined || $scope.password !==undefined){
                $http({method: 'POST', url: '/api/login', data:user}).
                    success(function(data, status, headers, config) {
                        console.log("login success");
                        flash.success = "Success";
                        $window.location.href="/home";
                    }).
                    error(function(data, status, headers, config) {
                        console.log("data:"+data.message);
                        $scope.$parent.failed_login = "There was an error logging into the system. " + data.message;
                    });
            }
        }
    }
]);


mainAppControllers.controller('RegistrationCtrl', ['$scope', '$http','$window','$location', 'flash',
    function ($scope, $http, $window, flash) {
        console.log("In Registration Controller");
        $scope.failed_register = "";

        $scope.register = function()
        {
            $scope.$parent.failed_register = "";
            var user = {"username": $scope.username, "password": $scope.password, "check_password": $scope.check_password};
            console.log(user);
            
            if($scope.username!==undefined || $scope.password !==undefined){
                //check to see if the two passwords are the same
                if($scope.password != $scope.check_password){
                    console.log("Passwords are bad");
                    $scope.$parent.failed_register = "The passwords need to match!";
                } else {
                    // check to see if the user exists already
                $http({method: 'POST', url: '/api/register', data:user}).
                    success(function(data, status, headers, config) {
                        console.log("login success");
                        $window.location.href="/home";
                    }).
                    error(function(data, status, headers, config) {
                        $scope.$parent.failed_register = "There was an error registering the user. " + data.message;
                    });
                } 
            }
            
        }
    }
]);

// /** controllers for setting up the Cloudant DB, Index, and admin user **/

// var setupAppControllers = angular.module('setupAppControllers', [ 'angular-flash.service', 'angular-flash.flash-alert-directive' ])
//                                 .config(function (flashProvider) {
//                                     // Support bootstrap 3.0 "alert-danger" class with error flash types
//                                     flashProvider.errorClassnames.push('alert-danger');
//                                 });


// setupAppControllers.controller('SetupCtrl', ['$scope', '$http', 'flash',
//     function ($scope, $http, flash) {
//         console.log("In the Setup Cloudant Controller");

//         $http({method: 'GET', url: '/setup/initialize'
//             }).
//             success(function(data, status, headers, config) {
//                 console.log("success");
//                 $scope.dbname = data.dbname;
//                 $scope.admin_user = data.admin_user;
//                 $scope.admin_pass = data.admin_pass;
//                 $scope.index_field = data.index_field;
//                 $scope.setup_done = true;
//                 $scope.setup_started = false;
//                 flash.success = "You have set up Cloudant successfully!";
//             }).
//             error(function(data, status, headers, config) {
//                 console.log(data);
//                 flash.error= data;
//             });
//     }
    
// ]);



/* web App Controllers */


var webAppControllers = angular.module('webAppControllers', []);

webAppControllers.controller('HomeCtrl', ['$scope', '$http','$window','$location',
    function ($scope, $http, $window, $location) {
        console.log("In the Home Controller");
    }
]);