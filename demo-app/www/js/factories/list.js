angular.module('demo-app')

.factory('listFactory', listFactory);

function listFactory() {
  var list = [];

  var factory = {
    isEmpty       : isEmpty,
    addProduct    : addProduct,
    removeProduct : removeProduct,
    getList       : getList,
    hasProduct    : hasProduct
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

  function removeProduct(productID) {
    for(var i = 0; i < list.length; i++) {
      if(list[i].ItemID === productID)
        list.splice(i,1);
    }
  }

  function getList() {
    return list;
  }

  function hasProduct(productID) {
    for(var i = 0; i < list.length; i++) {
      if(list[i].ItemID === productID)
        return true;
    }
    return false;
  }
}
