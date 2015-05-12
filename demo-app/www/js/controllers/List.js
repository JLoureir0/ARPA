angular.module('demo-app')

.controller('ListController', ListController);

function ListController($ionicLoading, listFactory) {
  var vm = this;

  vm.list = [];
  vm.isListEmpty = isListEmpty;

  getList();

  function isListEmpty() {
    return listFactory.isEmpty();
  }

  function getList() {
    vm.list = listFactory.getList();
  }
}
