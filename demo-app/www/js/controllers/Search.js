angular.module('demo-app')

.controller('SearchController', SearchController);

function SearchController($ionicLoading, productFactory) {
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
        vm.results = data;
        return vm.results;
      });
    }
  }
}
