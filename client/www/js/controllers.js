angular.module('arpa.controllers', [])

    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    .controller('AppsCtrl', function($scope) {})

    .controller('MainCtrl', function($scope, $localstorage, $http){
        $scope.userpicture = './img/logo_arpa.svg';

        if($localstorage.getObject('userinfo') != null) {
            var userinfo = $localstorage.getObject('userinfo');
            $scope.username = userinfo.name;
            //$scope.userbirthday = userinfo.birthday;
            var picture = 'http://graph.facebook.com/' + userinfo.id + '/picture?width=270&height=270';
            $http.get(picture).then(function(resp) {
                $scope.userpicture = picture;
            }, function(err) {
                $scope.userpicture = './img/logo_arpa.svg';
            });
        } else {
            $scope.username = 'ARPA';
            $scope.userpicture = './img/logo_arpa.svg';
        }
    })


    .controller('AllergensCtrl', function($scope, $ionicModal, $localstorage){
        $scope.value_allergies = true;
        $scope.value_intolerances = true;
        $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
        $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";


        $scope.plus_into = function() {
            if ($scope.value_intolerances == true) {
                $scope.value_intolerances = false;
                $scope.extra_icons_intol = "./img/allergens-icons/guardar.svg";
            }else{
                $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
                $scope.value_intolerances = true;
            }
        };

        $scope.plus_allergs = function() {
            if ($scope.value_allergies == true) {
                $scope.value_allergies = false;
                $scope.extra_icons_allergs = "./img/allergens-icons/guardar.svg";
                //$scope.push_down = {'opacity': "0.6"};
            }else{
                $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
                $scope.value_allergies = true;
                //$scope.push_down = {'opacity': "1"};
            }
        };

        $scope.addAllergens = function($index, $value){
            $scope.not_selected_allergens.splice($index,1);			
            $scope.allergens.push($value);
			$localstorage.setObject('allergies', {
				allergies: $scope.allergens
			});
        }

        $scope.removeAllergens = function($index, $value) {
            if ($scope.value_allergies != true) {
                $scope.allergens.splice($index, 1);
                $scope.not_selected_allergens.push($value);
				$localstorage.setObject('allergies', {
					allergies: $scope.allergens
				});
            }
        }

        $scope.addIntol = function($index, $value){
            $scope.not_selected_intolerances.splice($index,1);
            $scope.intolerances.push($value);
			$localstorage.setObject('intolerances', {
				intolerances: $scope.intolerances
			});
        }

        $scope.removeIntol = function($index, $value){
            if ($scope.value_intolerances != true) {
                $scope.intolerances.splice($index, 1);
                $scope.not_selected_intolerances.push($value);
				$localstorage.setObject('intolerances', {
					intolerances: $scope.intolerances
				});
            }

        }

        $scope.allergens = [
            {
                id: 1,
                name: "gluten",
                src: "./img/allergens-icons/gluten.svg"
            },
            {
                id: 2,
                name: "amendoins",
                src: "./img/allergens-icons/amendoins.svg"
            },
            {
                id: 3,
                name: "ovos",
                src: "./img/allergens-icons/ovos.svg"
            },
            {
                id: 4,
                name: "marisco",
                src: "./img/allergens-icons/marisco.svg"
            }
        ];

        $scope.not_selected_allergens = [
            {
                id: 1,
                name: "moluscos",
                src: "./img/allergens-icons/moluscos.svg"
            },
            {
                id: 2,
                name: "mostarda",
                src: "./img/allergens-icons/mostarda.svg"
            },
            {
                id: 3,
                name: "peixe",
                src: "./img/allergens-icons/peixe.svg"
            },
            {
                id: 4,
                name: "sesamo",
                src: "./img/allergens-icons/sesamo.svg"
            },
            {
                id: 5,
                name: "so2",
                src: "./img/allergens-icons/so2.svg"
            },
            {
                id: 6,
                name: "soja",
                src: "./img/allergens-icons/soja.svg"
            },
            {
                id: 7,
                name: "tremocos",
                src: "./img/allergens-icons/tremocos.svg"
            }
        ];

        $scope.intolerances = [
            {
                id: 1,
                name: "lacteos",
                src: "./img/allergens-icons/lacteos.svg"
            },
        ];

        $scope.not_selected_intolerances = [
            {
                id: 1,
                name: "moluscos",
                src: "./img/allergens-icons/moluscos.svg"
            },
            {
                id: 2,
                name: "mostarda",
                src: "./img/allergens-icons/mostarda.svg"
            },
            {
                id: 3,
                name: "peixe",
                src: "./img/allergens-icons/peixe.svg"
            },
            {
                id: 4,
                name: "sesamo",
                src: "./img/allergens-icons/sesamo.svg"
            },
            {
                id: 5,
                name: "so2",
                src: "./img/allergens-icons/so2.svg"
            },
            {
                id: 6,
                name: "soja",
                src: "./img/allergens-icons/soja.svg"
            },
            {
                id: 7,
                name: "tremocos",
                src: "./img/allergens-icons/tremocos.svg"
            }
        ];
    })


    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('DefinitionsCtrl', function($scope, $state, $localstorage, $window, $ionicModal, $cordovaFacebook) {
        $scope.sign_in_hide = false;

        $scope.fbLogin = function(){
            $cordovaFacebook.login(["public_profile", "email"])
                .then(function(success){
                    $cordovaFacebook.api("me", ["public_profile"])
                        .then(function(user) {
                            $scope.user = user;
                            var date = new Date($scope.user.birthday);
                            $localstorage.setObject('userinfo', {
                                id: $scope.user.id,
                                name: $scope.user.name,
                                birthday: date.toLocaleDateString()
                            });
                            $window.location.reload();
                        }, function (error) {

                        });

                }, function(error){

                });
        };
        $scope.logout = function(){
            $localstorage.setObject('userinfo',null);
            $window.location.reload();
        }

        $scope.contact = {
            name: 'Mittens Cat',
            info: 'Tap anywhere on the card to open the modal'
        }

        $ionicModal.fromTemplateUrl('./templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
    })

    .controller('SelectCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
        var firstRun;

        // set up some logic to decide which slide to show first
        $scope.$on('$ionicView.enter', function() {
            var jumpTo = firstRun ? 1 : 0;
            $ionicSlideBoxDelegate.slide(jumpTo);
            if (!firstRun) {
                firstRun = true;
            }
        });

        // Called to navigate to the main app
        $scope.startApp = function() {
            $state.go('tab.allergens');

        };
        $scope.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    });
