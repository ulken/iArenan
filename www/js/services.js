var app = angular.module('iA.services', [])

app.factory('BackendService', function($http, $q) {

})

app.factory('AuthenticationService', function ($http, $q) {
    var MAIN_ENDPOINT = 'http://arenan.com/index-home.php?go'
    var LOGIN_ENDPOINT = 'http://arenan.com/com/login/login-router.php'
    var POST_REQUEST_CONFIG = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: urlEncodeRequest
    }
    /**
     * Response always returns status code 200, so no way to tell error from OK
     * Location redirection header is ignored for the same reason
     * Index page has an ETag header if not authenticated
     * Only way to detect login error is to read content length
     * Fragile method, so compares to both to maximize correctness
     */
    var CONTENT_LENGTH_LOGGED_OUT = 1694
    var CONTENT_LENGTH_SUCCESS = 614
    var CONTENT_LENGTH_ERROR = 1189

    return {
        isAuthenticated: isAuthenticated,
        login: loginHandler
    }

    function isAuthenticated() {
        var deferred = $q.defer()

        $http.get(MAIN_ENDPOINT).then(function (response) {
            var headers = response.headers
            var hasETag = headers('ETag') !== null
            var contentLength = parseInt(headers('Content-Length'), 10)
            var isAuthenticated = !hasETag
                               && contentLength !== CONTENT_LENGTH_LOGGED_OUT

            deferred.resolve(isAuthenticated)
        })

        return deferred.promise
    }

    function loginHandler(loginData) {
        var deferred = $q.defer()

        $http.post(LOGIN_ENDPOINT, loginData, POST_REQUEST_CONFIG).then(function (response) {
            var headers = response.headers
            var contentLength = parseInt(headers('Content-Length'), 10)
            var isAuthenticated = contentLength === CONTENT_LENGTH_SUCCESS
                               || contentLength !== CONTENT_LENGTH_ERROR

            if (isAuthenticated) {
                deferred.resolve()
            }
            else {
                deferred.reject('Inloggning misslyckades')
            }
        })

        return deferred.promise
    }
})

function urlEncodeRequest(request) {
    var encode = encodeURIComponent
    return Object.keys(request)
    .map(function (key) {
        var value = request[key]
        return [key, value].map(encode).join('=')
    })
    .join('&')
}
