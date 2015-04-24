// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('arpa', ['ionic'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      })
    })

    .config(function($stateProvider, $urlRouterProvider) {

      openFB.init({appId:'367156356826931'});
      $stateProvider
          .state('app', {
            url: '/home',
            views: {
              home: {
                templateUrl: 'templates/home.html'
              }
            }
          })
          .state('mainPage', {
            url: '/mainPage',
            views: {
              home: {
                templateUrl: 'templates/mainPage.html'
              }
            }
          })
          .state('help', {
            url: '/help',
            views: {
              help: {
                templateUrl: 'help.html'
              }
            }
          })

      $urlRouterProvider.otherwise("/home");

    })

    .controller('homeController', function($scope, $state, $window, $ionicSideMenuDelegate){
      console.log("IN");
      $scope.fbLogin = function(){
        openFB.login(
          function(response){
            if(response.status == 'connected'){
              console.log('Login succedeed');
              $state.go('mainPage');
            }else{
              alert('Facebook login failed');
            }
          }, {scope: 'email, publish_actions'});
      }

    })


