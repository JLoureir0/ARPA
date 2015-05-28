// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('arpa', ['ionic', 'arpa.controllers', 'arpa.services', 'arpa.directives', 'btford.socket-io', 'ngCordova', 'ngAnimate', 'pascalprecht.translate'])

    .run(function($ionicPlatform, $cordovaDevice, $localstorage, Socket) {

        $ionicPlatform.ready(function() {

            $localstorage.set('device_id', $cordovaDevice.getUUID());

            console.log($localstorage.get('device_id'));
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }

            if (typeof cordova != "undefined") {

                cordova.plugins.backgroundMode.configure({
                    silent: true
                })

              cordova.plugins.backgroundMode.enable();

              console.log(cordova.plugins.backgroundMode.isEnabled());
              cordova.plugins.backgroundMode.onfailure = function(errorCode){
                  console.log("background mode not activated: error: " + errorCode);
              }

              cordova.plugins.backgroundMode.onactivate = function(){
                  console.log("background mode activated");
              }
            }

            Socket.forward('connection');

        });
    })

    .config(function($cordovaFacebookProvider){
        /*
         if(!window.cordova){ //Comment for browser testing, uncomment to deploy
         var appID = 367156356826931;
         var version = "v2.0";
         $cordovaFacebookProvider.browserInit(appID, version);
         }*/

        /*ionic.Platform.ready(function () {
            var appID = 367156356826931;
            var version = "v2.0";
            $cordovaFacebookProvider.browserInit(appID, version);
        });*/
    })
    .config(function ($translateProvider) {
        $translateProvider.translations('pt', {
            'TAB1': 'ALERGÉNIOS',
            'TAB2': 'APLICAÇÕES',
            'TAB3': 'DEFINIÇÕES',
            'ALLERGIES': 'ALERGIAS',
            'INTOLERANCES': 'INTOLERÂNCIAS'

        });

        $translateProvider.translations('en', {
            'TAB1': 'ALLERGENS',
            'TAB2': 'APPLICATIONS',
            'TAB3': 'DEFINITIONS',
            'ALLERGIES': 'ALLERGIES',
            'INTOLERANCES': 'INTOLERANCES'
        });

        $translateProvider.preferredLanguage('en');
    })

    .config(function($stateProvider, $urlRouterProvider) {

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

          .state('firstSelect', {
            url: "/",
            templateUrl: "templates/select.html",
            controller: 'SelectCtrl as selectCtrl'
          })
        // setup an abstract state for the tabs directive
          .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html",
            controller: 'MainCtrl'
          })

        // Each tab has its own nav history stack:

          .state('tab.allergens', {
            url: '/allergens',
            views: {
              'tab-allergens': {
                templateUrl: 'templates/tab-allergens.html',
                controller: 'AllergensCtrl as allergensCtrl'
              }
            }
          })

          .state('tab.definitions', {
            url: '/definitions',
            views: {
              'tab-definitions': {
                templateUrl: 'templates/tab-definitions.html',
                controller: 'DefinitionsCtrl'
              }
            }
          })

          .state('tab.dash', {
            url: '/dash',
            views: {
              'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
              }
            }
          })

          .state('tab.applications', {
            url: '/applications',
            views: {
              'tab-applications': {
                templateUrl: 'templates/tab-applications.html',
                controller: 'ApplicationsCtrl'
              }
            }
          })
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/allergens');

    });