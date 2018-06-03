scotchApp.controller('loginController', function($scope,$http,$window) {
    // create a message to display in our view

    $scope.login = function () {
        var userObj = Object.assign({}, $scope.user);
        $http({
            method: 'POST',
            url: '/users/login',
            data: userObj,
            headers: { 'Content-Type': 'application/json' }

        }).then(function onSuccess(response) {
            alert(response.data.message);

            if (response.data.success) {
                $scope.updateProfile();
            }
        }, function onError(response) {
            $window.location.path("#");
        });
        $window.location.href = "#";
    }
});