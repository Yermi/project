scotchApp.controller('usersController', function($scope,$http,$window) {

    $scope.selected = [];
    $scope.hideform = true;
    var sender = "admin"

    $http.get("users/getProfile")
        .then(function (response) {
            $scope.profile = response.data;
        });

    $http.get("users/getAll")
        .then(function (response) {
            $scope.users = response.data;
        });

    $scope.upgradeUser = function (user) {
        if(!$scope.selected.includes(user)){
            // push user to list for upgrade
            $scope.selected.push(user);
        }
        else if ($scope.selected.includes(user)){
            // remove user from list to upgrade
            index = $scope.selected.findIndex(x => x._id==user._id);
            $scope.selected.splice(index,1);
        }
    }

    $scope.upgrade = function () {
        $http({
            method: 'POST',
            url: 'users/upgradeUsers',
            data: { users: $scope.selected },
            headers: { 'Content-Type': 'application/json' }
        }).then(function onSuccess(response) {
            alert(response.data.message);
            $http.get("users/getAll")
                .then(function (response) {
                    $scope.users = response.data;
                })
        }, function onError(response) {
            alert(response.data);
            return;
        });

        $scope.selected = [];
    }

    $scope.createUser = function () {
        $scope.hideform = !$scope.hideform;
    }

    $scope.signup = function () {
        var userObj = Object.assign({}, $scope.user);
        userObj.sender = sender;
        $http({
            method: 'POST',
            url: '/users/signup',
            data: userObj,
            headers: { 'Content-Type': 'application/json' }

        }).then(function onSuccess(response) {
            alert(response.data.message);
            $http.get("users/getAll")
                .then(function (response) {
                    $scope.users = response.data;
                })
            if (response.data.success) {
                $scope.hideform = true;
            }
        }, function onError(response) {
            alert(response.data);
        });

    }
});