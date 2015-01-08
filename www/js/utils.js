angular.module('iA.utils', [])

.factory('$storage', ['$window', function ($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value)
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}')
        }
    }
}])

.factory('$Q', function ($q) {
    var $Q = angular.copy($q)

    return angular.extend($Q, {
        promise: promise,
        chain: chain
    })

    function promise() {
        var deferred = $Q.defer()
        deferred.resolve()
        return deferred.promise
    }

    function chain(actions, options) {
        options = options || {}
        var currentPromise = $Q.promise()
        var promises = actions.map(function (action) {
            return currentPromise = currentPromise.then(function () {
                return action()
            })
        })

        return $Q.all(promises).then(function (results) {
            var endResultOnly = options.endResultOnly || results.length === 1
            return endResultOnly ? results.pop() : results
        })
    }
})
