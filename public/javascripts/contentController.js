scotchApp.controller('mainController', function($scope,$http,$window) {
    // create a message to display in our view

    $http.get("users/getProfile")
        .then(function (response) {
            $scope.profile = response.data;
        });

    $scope.updateProfile = function () {
        $http({
            method: 'GET',
            url: '/users/getProfile'

        }).then(function onSuccess(response) {
            $scope.profile = response.data;
        });
    }

    $scope.logout = function () {
        $http({
            method: 'GET',
            url: '/users/logout'

        }).then(function onSuccess(response) {
            alert(response.data.message);
            if (response.data.success){
                $scope.updateProfile();
            }
        });
        $window.location.href = "#";
    }
});