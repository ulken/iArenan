
var app = angular.module('iA.services', [])

app.factory('HttpService', function ($http) {

    return {
        get: getRequest,
        post: postRequest
    }

    function requestTemplate(method, url, args, callback) {
        if (!args) {
            args = [{ data: {} }]
        }
        else if (!angular.isArray(args)) {
            args = [args]
        }
        args.unshift(url)

        return $http[method].apply(this, args)
    }

    function getRequest(url) {
        return requestTemplate('get', url, null)
    }

    function postRequest(url, args) {
        return requestTemplate('post', url, args)
    }
})

app.factory('BackendFrameService', function ($q) {
    var backendFrame

    return {
        getInstance: getInstance,
        load: load
    }

    function getInstance() {
        if (!backendFrame) {
            backendFrame = document.createElement('iframe')
            backendFrame.style.display = 'none'
            document.body.appendChild(backendFrame)
        }
        return backendFrame
    }

    function load(url) {
        var deferred = $q.defer()
        var instance = getInstance()
        instance.onload = function () {
            deferred.resolve(instance)
        }
        instance.src = url
        return deferred.promise
    }
})

app.factory('BackendParserService', function () {
    var MY_GLADIATOR_KEYS = [
        'image',
        'name',
        'title',
        'rank',
        'popularity',
        'race',
        'age',
        'gender',
        'clan',
        'clanStatus',
        'level',
        'experiencePoints',
        'capital',
        'health',
        'shape',
        'rounds'
    ]

    return {
        parseMyGladiator: parseMyGladiator
    }

    function parseMyGladiator(backendFrame) {
        var IDENTIFIER = 'do_myglinfo'
        var FUNCTION_REGEXP = new RegExp(IDENTIFIER + '\\((.*)\\);')

        var data = {}
        angular.element(backendFrame.contentDocument)
            .find('script')
            .text()
            .match(FUNCTION_REGEXP).pop()
            .replace(/'/g,'')
            .split(',')
            .forEach(function (value, index) {
                data[MY_GLADIATOR_KEYS[index]] = value
            })

        return data
    }
})

app.factory('BackendService',
    function (HttpService, BackendFrameService, BackendParserService) {
    var ENDPOINT = {
        START_GLADIATOR_II: 'http://arenan.com/gl2/startup.php',
        MY_GLADIATOR: 'http://arenan.com/gl2/mygladis/mygl.php'
    }

    var BackendFrame = BackendFrameService
    var BackendParser = BackendParserService

    return {
        startGladiatorII: startGladiatorII,
        getMyGladiator: getMyGladiator
    }

    function startGladiatorII() {
        return HttpService.get(ENDPOINT.START_GLADIATOR_II)
    }

    function getMyGladiator() {
        return BackendFrame
            .load(ENDPOINT.MY_GLADIATOR)
            .then(function (backendFrame) {
                return BackendParser.parseMyGladiator(backendFrame)
            })
    }
})

app.factory('AuthenticationService', function (HttpService) {
    var ENDPOINT = {
        MAIN: 'http://arenan.com/index-home.php?go',
        LOGIN: 'http://arenan.com/com/login/login-router.php',
        LOGOUT: 'http://arenan.com/com/my/login/login-off.php'
    }
    /**
    * Response always returns status code 200, so no way to tell error from OK
    * Location redirection header is ignored for the same reason
    * Index page has an ETag header if not authenticated
    * Only way to detect login error is to read content length
    * Fragile method, so compares to both to maximize correctness
    */
    var CONTENT_LENGTH = {
        LOGGED_OUT: 1694,
        SUCCESS: 614,
        ERROR: 1189
    }

    return {
        isAuthenticated: isAuthenticated,
        login: loginHandler,
        logout: logoutHandler
    }

    function isAuthenticated() {
        return HttpService.get(ENDPOINT.MAIN).then(function (response) {
            var headers = response.headers
            var hasETag = headers('ETag') !== null
            var contentLength = parseInt(headers('Content-Length'), 10)
            var isAuthenticated = !hasETag
            && contentLength !== CONTENT_LENGTH.LOGGED_OUT

            return isAuthenticated
        })
    }

    function loginHandler(loginData) {
        return HttpService.post(ENDPOINT.LOGIN, loginData).then(function (response) {
            var headers = response.headers
            var contentLength = parseInt(headers('Content-Length'), 10)
            var isAuthenticated = contentLength === CONTENT_LENGTH.SUCCESS
            || contentLength !== CONTENT_LENGTH.ERROR

            return isAuthenticated
        })
    }

    function logoutHandler() {
        return HttpService.get(ENDPOINT.LOGOUT)
    }
})
