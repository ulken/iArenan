var app = angular.module('iArenan', [
    'ionic',
    'iA.controllers',
    'iA.services',
    'iA.utils'
])

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        }
    })
})

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('ia', {
        url: '/ia',
        abstract: true,
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl',
        resolve: {
            isAuthenticated: function (AuthenticationService) {
                return AuthenticationService.isAuthenticated()
            }
        },
        onEnter: function ($state, isAuthenticated) {
            if (!isAuthenticated) {
                $state.go('login')
            }
        }
    })

    .state('ia.gladiator', {
        url: '/gladiator',
        views: {
            'tabGladiator': {
                templateUrl: 'templates/gladiator.html',
                controller: 'GladiatorCtrl'
            }
        },
        resolve: {
            myGladiator: function ($Q, BackendService) {
                return $Q.chain([
                    BackendService.startGladiatorII,
                    BackendService.getMyGladiator
                    ], { endResultOnly: true })
                }
            }
    })

    .state('ia.arena', {
        url: '/arena',
        views: {
            'tabArena': {
                templateUrl: 'templates/arena.html',
                controller: 'ArenaCtrl'
            }
        },
        resolve: {
            }
        })

    .state('ia.clans', {
        url: '/clans',
        views: {
            'tabClans': {
                templateUrl: 'templates/clans.html',
                controller: 'ClansCtrl'
            }
        },
        resolve: {
            }
        })

    .state('ia.market', {
        url: '/market',
        views: {
            'tabMarket': {
                templateUrl: 'templates/market.html',
                controller: 'MarketCtrl'
            }
        },
        resolve: {
            }
        })

    .state('ia.town', {
        url: '/town',
        views: {
            'tabTown': {
                templateUrl: 'templates/town.html',
                controller: 'TownCtrl'
            }
        },
        resolve: {
            }
        })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        resolve: {
            isAuthenticated: function (AuthenticationService) {
                return AuthenticationService.isAuthenticated()
            }
        },
        onEnter: function ($state, isAuthenticated) {
            if (isAuthenticated) {
                $state.go('ia.gladiator')
            }
        }
    })

    $urlRouterProvider.otherwise('/login')
})

app.config(function ($httpProvider) {
    var defaults = $httpProvider.defaults

    defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    defaults.transformRequest = transformRequest

    function transformRequest(data, getHeaders) {
        var headers = getHeaders()

        if (headers['Content-Type'] === defaults.headers.post['Content-Type']) {
            return urlEncode(data)
        }

        return data
    }

    function urlEncode(data) {
        var encode = encodeURIComponent
        return Object.keys(data)
        .map(function (key) {
            var value = data[key]
            return [key, value].map(encode).join('=')
        })
        .join('&')
    }
})
