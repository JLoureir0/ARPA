angular.module('controllers', [])

.controller('SearchCtrl', function($scope, $http) {
  $scope.payload = {
    inSessionID: "20dda1cb28a44b7f93e359e8f3b5f1c2",
    inSortOrder: "ASC",
    inPageNumber: 1,
    inPageSize: 50
  };

  $scope.search = function() {
    var url = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSProductCatalog/SearchProduct';
    $http.post(url, $scope.payload, { headers: { 'Content-Type': 'application/json' } })
      .then(function(response) {
        $scope.results = response.data.SearchProductResult.Result.ItemList;
      });
  };
});
