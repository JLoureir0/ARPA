angular.module('arpa.controllers', [])

    .controller('AppsCtrl', function($scope) {})

    .controller('MainCtrl', function($scope, $ionicPlatform, $localstorage, $http, Socket){
        $scope.userpicture = './img/logo_arpa.svg';

        var userinfo = $localstorage.getObject('userinfo');

        Socket.forward('text', $scope);
        console.log("cenas");

        $scope.$on('socket:text', function(ev, data){
            console.log(data);
        })

        if(userinfo){
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
                $scope.allergens.splice($index,1);
                $scope.not_selected_allergens.push($value);
                $localstorage.setObject('allergies', {
                    allergies: $scope.allergens
                });
            }
        }

        $scope.addIntol = function($index, $value){
            $scope.not_selected_allergens.splice($index,1);
            $scope.intolerances.push($value);
            $localstorage.setObject('intolerances', {
                intolerances: $scope.intolerances
            });
        }

        $scope.removeIntol = function($index, $value){
            if ($scope.value_intolerances != true) {
                $scope.intolerances.splice($index,1);
                $scope.not_selected_allergens.push($value);
                $localstorage.setObject('intolerances', {
                    intolerances: $scope.intolerances
                });
            }

        }

        $scope.not_selected_allergens = [
            {
                id: 1,
                name: "lacteos",
                src: "./img/allergens-icons/lacteos.svg"
            },
            {
                id: 2,
                name: "gluten",
                src: "./img/allergens-icons/gluten.svg"
            },
            {
                id: 3,
                name: "amendoins",
                src: "./img/allergens-icons/amendoins.svg"
            },
            {
                id: 4,
                name: "ovos",
                src: "./img/allergens-icons/ovos.svg"
            },
            {
                id: 5,
                name: "marisco",
                src: "./img/allergens-icons/marisco.svg"
            },
            {
                id: 6,
                name: "moluscos",
                src: "./img/allergens-icons/moluscos.svg"
            },
            {
                id: 7,
                name: "mostarda",
                src: "./img/allergens-icons/mostarda.svg"
            },
            {
                id: 8,
                name: "peixe",
                src: "./img/allergens-icons/peixe.svg"
            },
            {
                id: 9,
                name: "sesamo",
                src: "./img/allergens-icons/sesamo.svg"
            },
            {
                id: 10,
                name: "so2",
                src: "./img/allergens-icons/so2.svg"
            },
            {
                id: 11,
                name: "soja",
                src: "./img/allergens-icons/soja.svg"
            },
            {
                id: 12,
                name: "tremocos",
                src: "./img/allergens-icons/tremocos.svg"
            }
        ];

        $scope.allergens = [];

        $scope.intolerances = [];

        if($localstorage.getObject('allergies') != null) {
            var allergies = $localstorage.getObject('allergies').allergies;
            var indexy = 0;
            while(indexy < allergies.length) {
                if(allergies[indexy].$$hashKey != null) {
                    allergies[indexy].$$hashKey = null;
                }
                $scope.allergens.push(allergies[indexy]);
                for(var i = 0; i < $scope.not_selected_allergens.length; i++) {
                    if(allergies[indexy].name == $scope.not_selected_allergens[i].name) {
                        $scope.not_selected_allergens.splice(i,1);
                    }
                }
                indexy++;
            }
        }

        if($localstorage.getObject('intolerances') != null) {
            var intolerances = $localstorage.getObject('intolerances').intolerances;
            var indexz = 0;
            while(indexz < intolerances.length) {
                if(intolerances[indexz].$$hashKey != null) {
                    intolerances[indexz].$$hashKey = null;
                }
                $scope.intolerances.push(intolerances[indexz]);
                for(var j = 0; j < $scope.not_selected_allergens.length; j++) {
                    if(intolerances[indexz].name == $scope.not_selected_allergens[j].name) {
                        $scope.not_selected_allergens.splice(j,1);
                    }
                }
                indexz++;
            }
        }

    })


    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('ProfileCtrl', function($scope) {
        $scope.myActiveSlide = 1;
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

    .controller('SelectCtrl', function($scope, $state, $ionicSlideBoxDelegate, $localstorage) {
        var firstRun = $localstorage.get('firstRun', false);
        if(firstRun){
            $state.go('tab.allergens');
        }
        // set up some logic to decide which slide to show first
        $scope.$on('$ionicView.enter', function() {
            var jumpTo = firstRun ? 1 : 0;
            $ionicSlideBoxDelegate.slide(jumpTo);
            $localstorage.set('firstRun', true);
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
