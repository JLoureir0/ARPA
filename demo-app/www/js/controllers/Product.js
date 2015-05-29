angular.module('demo-app')

.controller('ProductController', SearchController);

function SearchController($ionicLoading, $ionicPlatform, $ionicPopup, $state, $stateParams, productFactory, listFactory, $http) {
  var vm = this;

  vm.product               = null;
  vm.addProductToList      = addProductToList;
  vm.removeProductFromList = removeProductFromList;
  vm.isProductOnList       = isProductOnList;

  $ionicLoading.show({ delay: 250 });

  getProductInfo();

  function addProductToList() {
    listFactory.addProduct(vm.product);
    console.log(vm.product.Name);
    var id;

    $ionicPlatform.ready(function(){
      id = device.uuid;

      var body = {
        product: vm.product.Name,
        id: id
      };
      console.log(JSON.stringify(body));
      $http.post('http://arpa.herokuapp.com/product_filter', body);
      alertButton('Product added to the list');

    })



  }

  function removeProductFromList() {
    listFactory.removeProduct(vm.product.ItemID);
    alertButton('Product removed from the list');
  }

  function isProductOnList() {
    return listFactory.hasProduct(vm.product.ItemID);
  }

  function getProductInfo() {
    return productFactory.getProductInfo($stateParams.productID)
    .then(function(data) {
      $ionicLoading.hide();
      vm.product = data;
      return vm.product;
    })
    .catch(function(reason) {
      $ionicLoading.hide();
      alertButton('Check your internet connection!');
      $state.go('search');
    });
  }

  function alertButton(title) {
    $ionicPopup.alert({
      title   : title,
      buttons : [{ text: 'Ok', type: 'button-assertive' }]
    });
  }
}
