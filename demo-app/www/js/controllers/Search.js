angular.module('demo-app')

.controller('SearchController', SearchController);

function SearchController($ionicLoading, $ionicPopup, productFactory) {
  var vm = this;

  vm.search = search;

  function search() {
    try{
      cordova.plugins.Keyboard.close();
    }catch(e) {}

    $ionicLoading.show({ delay: 250 });

    searchProducts();

    function searchProducts() {
      return productFactory.searchProducts(vm.query)
      .then(function(data) {
        $ionicLoading.hide();
        vm.results = data;
        return vm.results;
      })
      .catch(function(reason) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title   : 'Check your internet connection!',
          buttons : [{ text: 'Ok', type: 'button-assertive' }]
        });
      });
    }
  }
}
