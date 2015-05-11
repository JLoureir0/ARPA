angular.module('demo-app')

.controller('ProductController', SearchController);

function SearchController($ionicLoading, $stateParams, productFactory) {
  var vm = this;

  $ionicLoading.show({ delay: 250 });

  getProductInfo();

  function getProductInfo() {
    return productFactory.getProductInfo($stateParams.productID)
    .then(function(data) {
      vm.product = data;
      return vm.product;
    });
  }
}
