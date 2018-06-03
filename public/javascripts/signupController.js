// signupController.js
scotchApp.controller('signupController', function($scope,$http,$window) {

    var sender = 'user'

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

            if (response.data.success) {
                $scope.updateProfile();
            }
        }, function onError(response) {
            $window.location.path("#");
        });
        $window.location.href = "#";
    }
});