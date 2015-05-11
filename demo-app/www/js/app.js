angular.module('demo-app', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/search');

  $stateProvider

    .state('search', {
      url         : '/search',
      templateUrl : 'templates/search.html',
      controller  : 'SearchController as vm'
    })
    .state('product', {
      url         : '/product/{productID:^[0-9]{7}$}',
      templateUrl : 'templates/product.html',
      controller  : function() {}
    });
});
