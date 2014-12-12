var app = angular.module('iA.services', [])

app.factory('DataService', function($http) {
    var LOGIN_ENDPOINT = 'http://arenan.com/com/login/login-router.php'

    return {
        login: loginHandler
    }

    function loginHandler(username, password) {
        return $http.post(LOGIN_ENDPOINT, {
            profil: username,
            password: password
        })
    }
})
