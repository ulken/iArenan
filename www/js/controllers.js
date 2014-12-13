var app = angular.module('iA.controllers', [])

app.controller('MainCtrl', function($scope) {

})

app.controller('LoginCtrl', function ($scope, $state, $timeout, $storage, BackendService) {
    var STORAGE = {
        SETTINGS: 'ia-settings'
    }
    $scope.loginData = {}
    $scope.notification = {}
    $scope.settings = $storage.getObject(STORAGE.SETTINGS, false)

    $scope.doLogin = function () {
        BackendService.login($scope.loginData)
        .then(function () {
            // $state.go('main')
            $storage.setObject(STORAGE.SETTINGS, $scope.settings)
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
