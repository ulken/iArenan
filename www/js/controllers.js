var app = angular.module('iA.controllers', [])

app.controller('MainCtrl', function($scope, AuthenticationService) {
    $scope.doLogout = function () {
        AuthenticationService.logout()
    }
})

app.controller('HomeCtrl', function ($scope, $timeout, $ionicModal, BackendService, myGladiator) {
    $scope.notification = {}

    updateMyGladiator(myGladiator)

    $ionicModal.fromTemplateUrl('templates/more.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })

    $scope.$on('$destroy', function() {
        $scope.modal.remove()
    })

    $scope.refreshData = function () {
        BackendService.getMyGladiator()
        .then(updateMyGladiator)
        .catch(alertError)
        .finally(function () {
            $scope.$broadcast('scroll.refreshComplete')
        })
    }

    function updateMyGladiator(data) {
        data.image = 'http://arenan.com/gl2/img/gl/' + data.image + '.jpg'
        data.age = data.age.slice(0, -1) + ' år)'
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
                $scope.loginData = {}
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
