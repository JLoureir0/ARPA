angular.module('controllers', [])

.controller('SearchCtrl', function($scope, $http, $ionicLoading, $ionicPopup) {
  $scope.payload = {
    inSortOrder  : "ASC",
    inPageNumber : 1,
    inPageSize   : 50
  };

  $scope.search = function() {
    try{
      cordova.plugins.Keyboard.close();
    }catch(e) {}
    $ionicLoading.show({ delay: 500 });
    search_product();
  };

  function search_product() {
    var url = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSProductCatalog/SearchProduct';
    $http.post(url, $scope.payload, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 })
    .then(function(response) {
      var result = response.data.SearchProductResult;
      if(result.Code === 0) {
        $scope.results = result.Result.ItemList;
        $ionicLoading.hide();
      }
      else if(result.Code === 1) {
        $scope.results = [{ Name: result.Message }];
        $ionicLoading.hide();
      }
      else if(result.Code === -88888 || result.Code === -99999) {
        anonymous_authentication(search_product);
      }
    }, function() {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title   : 'Check your internet connection!',
        buttons : [{ text: 'Ok', type: 'button-assertive' }]
      });
    });
  }

  function anonymous_authentication(done) {
    var url = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSLogin/AuthenticateAnonymous';
    $http.post(url, { inLanguage:"pt" }, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 })
    .then(function(response) {
      if(response.data.AuthenticateAnonymousResult.Code === 0)
        $scope.payload.inSessionID = response.data.AuthenticateAnonymousResult.Result;
      done();
    }, function() {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title   : 'Check your internet connection!',
        buttons : [{ text: 'Ok', type: 'button-assertive' }]
      });
    });
  }
});
