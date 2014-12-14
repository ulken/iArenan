var app = angular.module('iA.controllers', [])

app.controller('MainCtrl', function($scope, $state, isLoggedIn) {
    if (isLoggedIn) {
        $state.go('ia.home')
    }
    else {
        $state.go('login')
    }
})

app.controller('HomeCtrl', function ($scope, BackendService) {
    console.log('HOME')
})

app.controller('LoginCtrl', function ($scope, $state, $timeout, AuthenticationService) {
    $scope.loginData = {}
    $scope.notification = {}

    $scope.doLogin = function () {
        AuthenticationService.login($scope.loginData)
        .then(function () {
            $state.go('ia.home')
        })
        .catch(alertError)
    }

    function alertError(errorMessage) {
        $scope.notification = {
            message: errorMessage,
            type: 'assertive',
            isShowing: true
        }

        $timeout(function () {
            $scope.notification = {}
        }, 2000)
    }
})
