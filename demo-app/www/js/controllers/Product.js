angular.module('demo-app')

.controller('ProductController', SearchController);

function SearchController($ionicLoading, $ionicPopup, $state, $stateParams, productFactory) {
  var vm = this;

  $ionicLoading.show({ delay: 250 });

  getProductInfo();

  function getProductInfo() {
    return productFactory.getProductInfo($stateParams.productID)
    .then(function(data) {
      $ionicLoading.hide();
      vm.product = data;
      return vm.product;
    })
    .catch(function(reason) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title   : 'Check your internet connection!',
        buttons : [{ text: 'Ok', type: 'button-assertive' }]
      });
      $state.go('search');
    });
  }
}
