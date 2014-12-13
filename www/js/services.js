var app = angular.module('iA.services', [])

app.factory('BackendService', function($http, $q) {
    var LOGIN_ENDPOINT = 'http://arenan.com/com/login/login-router.php'
    var REQUEST_HEADERS = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    /**
     * Response always returns status code 200, so no way to tell error from OK
     * Location redirection header is ignored for the same reason
     * Only way to detect login error is to read content length
     * If ok: 614, if error: 1189
     * Fragile method, so compares to both to maximize correctness
     */
    var CONTENT_LENGTH_OK = 614
    var CONTENT_LENGTH_ERROR = 1189

    return {
        login: loginHandler
    }

    function loginHandler(loginData) {
        var deferred = $q.defer()
        var request = {
            method: 'POST',
            url: LOGIN_ENDPOINT,
            data: loginData,
            headers: REQUEST_HEADERS,
            transformRequest: urlEncodeRequest
        }

        $http(request).then(function (response) {
            var headers = response.headers
            var contentLength = parseInt(headers('Content-Length'), 10)
            var isAuthenticated = contentLength === CONTENT_LENGTH_OK
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
