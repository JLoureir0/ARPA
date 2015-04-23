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

      $stateProvider
          .state('app', {
            url: '/home',
            views: {
              home: {
                templateUrl: 'templates/home.html'
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

    .controller('homeController', function($scope, $window, $ionicSideMenuDelegate){
        $scope.width = function () {
            return $window.innerWidth;
        };

        $scope.openMenu = function() {
            $ionicSideMenuDelegate.toggleRight(true);
        };

        $scope.isWalletShown = false;
        $scope.toggleWallet = function () {
            $scope.isWalletShown = $scope.isWalletShown === false ? true : false;
            console.log('Toggled');
        }
    })

    .directive('fader', function ($timeout, $ionicGesture, $ionicSideMenuDelegate) {
        return {
            restrict: 'E',
            require: '^ionSideMenus',
            scope: true,
            link: function($scope, $element, $attr, sideMenuCtrl) {
                $ionicGesture.on('tap', function(e) {
                    $ionicSideMenuDelegate.toggleRight(true);
                }, $element);
                $ionicGesture.on('dragleft', function(e) {
                    sideMenuCtrl._handleDrag(e);
                    e.gesture.srcEvent.preventDefault();
                }, $element);
                $ionicGesture.on('dragright', function(e) {
                    sideMenuCtrl._handleDrag(e);
                    e.gesture.srcEvent.preventDefault();
                }, $element);
                $ionicGesture.on('release', function(e) {
                    sideMenuCtrl._endDrag(e);
                }, $element);
                $scope.sideMenuDelegate = $ionicSideMenuDelegate;
                $scope.$watch('sideMenuDelegate.getOpenRatio()', function(ratio) {
                    if (Math.abs(ratio)<1) {
                        $element[0].style.zIndex = "1";
                        $element[0].style.opacity = 0.7-Math.abs(ratio);
                    } else {
                        $element[0].style.zIndex = "-1";
                    }
                });
            }
        }
    })

    .directive('canDragMenu', function ($timeout, $ionicGesture, $ionicSideMenuDelegate) {
        return {
            restrict: 'A',
            require: '^ionSideMenus',
            scope: true,
            link: function($scope, $element, $attr, sideMenuCtrl) {
                $ionicGesture.on('dragleft', function(e) {
                    sideMenuCtrl._handleDrag(e);
                    e.gesture.srcEvent.preventDefault();
                }, $element);
                $ionicGesture.on('dragright', function(e) {
                    sideMenuCtrl._handleDrag(e);
                    e.gesture.srcEvent.preventDefault();
                }, $element);
                $ionicGesture.on('release', function(e) {
                    sideMenuCtrl._endDrag(e);
                }, $element);
            }
        }
    })
