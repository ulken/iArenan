var app = angular.module('iArenan', [
    'ionic',
    'iA.controllers',
    'iA.services',
    'iA.utils'
])

app.run(function($ionicPlatform, $state, AuthenticationService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        }

        AuthenticationService.isAuthenticated()
        .then(function (isAuthenticated) {
            if (isAuthenticated) {
                $state.go('main')
            }
        })
    })
})

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login')

    $stateProvider

    .state('main', {
        url: '/',
        // abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
})
