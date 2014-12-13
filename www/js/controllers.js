var app = angular.module('iA.controllers', [])

app.controller('MainCtrl', function($scope) {

})

app.controller('LoginCtrl', function ($scope, $state, $timeout, BackendService) {
    $scope.loginData = {}
    $scope.notification = {}

    $scope.doLogin = function () {
        BackendService.login($scope.loginData)
        .then(function () {
            // $state.go('main')
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
