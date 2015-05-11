angular.module('demo-app')

.factory('productFactory', productFactory);

function productFactory($http, $ionicLoading, $ionicPopup) {
  var config = {
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
  };

  var inSessionID;

  var factory = {
    searchProducts: searchProducts,
    getProductInfo: getProductInfo
  };

  return factory;

  function searchProducts(query) {
    var searchURL = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSProductCatalog/SearchProduct';

    var searchPayload = {
      inSortOrder  : "ASC",
      inPageNumber : 1,
      inPageSize   : 50,
      inKeyword    : query,
      inSessionID  : inSessionID
    };

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
        return anonymousAuthentication(query, searchProducts);
      }
    }
  }

  function getProductInfo(productID) {
  }

  function httpFailed() {
    $ionicLoading.hide();
    $ionicPopup.alert({
      title   : 'Check your internet connection!',
      buttons : [{ text: 'Ok', type: 'button-assertive' }]
    });
  }

  function anonymousAuthentication(query, done) {
    var authenticationURL     = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSLogin/AuthenticateAnonymous';
    var authenticationPayload = { inLanguage: "pt"};

    return $http.post(authenticationURL, authenticationPayload, config)
    .then(authenticationComplete)
    .catch(httpFailed);

    function authenticationComplete(response) {
      var result = response.data.AuthenticateAnonymousResult;
      if(result.Code === 0)
        inSessionID = result.Result;
      return done(query);
    }
  }
}
