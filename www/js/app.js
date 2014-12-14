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
    })
})

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('ia', {
        url: '/ia',
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl',
        resolve: {
            isLoggedIn: function (AuthenticationService) {
                return AuthenticationService.isAuthenticated()
            }
        }
    })

    .state('ia.home', {
        url: '/home',
        views: {
            'viewContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    $urlRouterProvider.otherwise('/ia/home')
})
