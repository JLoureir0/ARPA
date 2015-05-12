angular.module('demo-app')

.factory('productFactory', productFactory);

function productFactory($http) {
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

    var payload = {
      inSortOrder  : "ASC",
      inPageNumber : 1,
      inPageSize   : 50,
      inKeyword    : query,
      inSessionID  : inSessionID
    };

    return $http.post(searchURL, payload, config)
    .then(searchProductsComplete)
    .catch(httpFailed);

    function searchProductsComplete(response) {
      var result = response.data.SearchProductResult;
      if(result.Code === 0)
        return result.Result.ItemList;
      else if(result.Code === 1)
        return [{ Name: result.Message }];
      else if(result.Code === -88888 || result.Code === -99999)
        return anonymousAuthentication(query, searchProducts);
    }
  }

  function getProductInfo(productID) {
    var productInfoURL = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSProductCatalog/GetProductDetail';

    var payload = {
      inSessionID : inSessionID,
      inItemID    : productID
    };

    return $http.post(productInfoURL, payload, config)
    .then(getProductInfoComplete)
    .catch(httpFailed);

    function getProductInfoComplete(response) {
      var result = response.data.GetProductDetailResult;
      if(result.Code === 0)
        return result.Result;
      else if(result.Code === -88888 || result.Code === -99999)
        return anonymousAuthentication(productID, getProductInfo);
    }
  }

  function httpFailed(reason) {
    throw reason;
  }

  function anonymousAuthentication(param, done) {
    var authenticationURL     = 'https://m.continente.pt/MRS.Web/Proxy.ashx?Method=/BSLogin/AuthenticateAnonymous';
    var authenticationPayload = { inLanguage: "pt"};

    return $http.post(authenticationURL, authenticationPayload, config)
    .then(authenticationComplete)
    .catch(httpFailed);

    function authenticationComplete(response) {
      var result = response.data.AuthenticateAnonymousResult;
      if(result.Code === 0)
        inSessionID = result.Result;
      return done(param);
    }
  }
}
