angular.module('demo-app')

.factory('productFactory', productFactory);

function productFactory($http, $ionicLoading, $ionicPopup) {
  var factory = {
    searchProducts: searchProducts,
    getProductInfo: getProductInfo
  };

  var searchPayload = {
    inSortOrder  : "ASC",
    inPageNumber : 1,
    inPageSize   : 50,
  };

  return factory;

  function searchProducts(query) {
    var searchURL = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSProductCatalog/SearchProduct';
    var config    = {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    };

    if(query)
      searchPayload.inKeyword = query;

    return $http.post(searchURL, searchPayload, config)
    .then(searchProductsComplete)
    .catch(httpFailed);

    function searchProductsComplete(response) {
      var result = response.data.SearchProductResult;
      if(result.Code === 0) {
        $ionicLoading.hide();
        return result.Result.ItemList;
      }
      else if(result.Code === 1) {
        $ionicLoading.hide();
        return [{ Name: result.Message }];
      }
      else if(result.Code === -88888 || result.Code === -99999) {
        return anonymousAuthentication(searchProducts);
      }
    }

    function httpFailed() {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title   : 'Check your internet connection!',
        buttons : [{ text: 'Ok', type: 'button-assertive' }]
      });
    }

    function anonymousAuthentication(done) {
      var authenticationURL     = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSLogin/AuthenticateAnonymous';
      var authenticationPayload = { inLanguage: "pt"};

      return $http.post(authenticationURL, authenticationPayload, config)
      .then(authenticationComplete)
      .catch(httpFailed);

      function authenticationComplete(response) {
        var result = response.data.AuthenticateAnonymousResult;
        if(result.Code === 0)
          searchPayload.inSessionID = result.Result;
        return done();
      }
    }
  }

  function getProductInfo(productID) {
  }
}
