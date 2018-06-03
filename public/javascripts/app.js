// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider,$locationProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl : '/home.html',
            controller  : 'mainController'
        })

        // route for the login page
        .when('/login', {
            templateUrl : '/login.html',
            controller  : 'loginController'
        })

        // route for the sign-up page
        .when('/signup', {
            templateUrl : '/sign-up.html',
            controller  : 'signupController'
        })

        // route for the users page
        .when('/users', {
            templateUrl : '/users.html',
            controller  : 'usersController'
        })

        .otherwise({
        redirectTo: '/home.html'
    });

});