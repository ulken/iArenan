// angular.module is a global place for creating, registering and retrieving Angular modules
var app = angular.module('iArenan', [
    'ionic',
    'iA.controllers',
    'iA.services'
])

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault()
        }
    })
})

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login')

    $stateProvider

    .state('main', {
        url: '/',
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

})
