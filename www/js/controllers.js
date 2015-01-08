var app = angular.module('iA.controllers', [])

app.controller('MainCtrl', function($scope) {
})

app.controller('HomeCtrl', function ($scope, $Q, $timeout, BackendService) {
    $scope.notification = {}

    $Q.chain([
        BackendService.startGladiatorII,
        BackendService.getMyGladiator
    ], { endResultOnly: true })
    .then(updateData)
    .catch(alertError)

    $scope.refreshData = function () {
        BackendService.getMyGladiator()
        .then(updateData)
        .catch(alertError)
        .finally(function () {
            $scope.$broadcast('scroll.refreshComplete')
        })
    }

    function updateData(data) {
        data.image = 'http://arenan.com/gl2/img/gl/' + data.image + '.jpg'
        $scope.data = data
    }

    function notify(message) {
        $scope.notification = {
            message: message,
            type: 'stable',
            isShowing: true
        }

        $timeout(function () {
            $scope.notification = {}
        }, 2000)
    }

    function alertError(message) {
        $scope.notification = {
            message: message,
            type: 'assertive',
            isShowing: true
        }

        $timeout(function () {
            $scope.notification = {}
        }, 2000)
    }
})

app.controller('LoginCtrl',
    function ($scope, $state, $timeout, AuthenticationService) {
    $scope.loginData = {}
    $scope.notification = {}

    $scope.doLogin = function () {
        AuthenticationService.login($scope.loginData)
        .then(function (isAuthenticated) {
            if (isAuthenticated) {
                $state.go('ia.home')
            }
            else {
                alertError('Inloggningen misslyckades')
            }
        })
        .catch(alertError)
    }

    function alertError(message) {
        $scope.notification = {
            message: message,
            type: 'assertive',
            isShowing: true
        }

        $timeout(function () {
            $scope.notification = {}
        }, 2000)
    }
})
