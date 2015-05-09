angular.module('controllers', [])

.controller('SearchCtrl', function($scope) {
  $scope.search = function() {
    alert('SEARCH');
  };
});
