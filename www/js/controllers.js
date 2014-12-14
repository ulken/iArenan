var app = angular.module('iA.controllers', [])

app.controller('MainCtrl', function($scope, $state, AuthenticationService) {
    AuthenticationService.isAuthenticated()
    .then(function (isAuthenticated) {
        if (!isAuthenticated) {
            $state.go('login')
        }
    })
})

app.controller('LoginCtrl', function ($scope, $state, $timeout, AuthenticationService, BackendService) {
    $scope.loginData = {}
    $scope.notification = {}

    $scope.doLogin = function () {
        AuthenticationService.login($scope.loginData)
        .then(function () {
            $state.go('main')
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
