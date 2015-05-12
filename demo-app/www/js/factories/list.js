angular.module('demo-app')

.factory('listFactory', listFactory);

function listFactory() {
  var list = [];

  var factory = {
    isEmpty    : isEmpty,
    addProduct : addProduct,
    getList    : getList,
    hasProduct : hasProduct
  };

  return factory;

  function isEmpty() {
    if(list.length === 0)
      return true;
    return false;
  }

  function addProduct(product) {
    list.push(product);
  }

  function getList() {
    return list;
  }

  function hasProduct(productID) {
    list.forEach(function(product) {
      if(product.productID === productID)
        return true;
    });
    return false;
  }
}
