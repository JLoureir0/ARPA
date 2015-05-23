var host = "http://localhost:3000/allergies";

angular.module('arpa.controllers', [])


.controller('AppsCtrl', function($scope) {})

.controller('MainCtrl', function($ionicPlatform, $scope, $localstorage, $http, Socket, $cordovaLocalNotification){
    $scope.userpicture = './img/logo_arpa.svg';

    Socket.forward('text', $scope);
    console.log("cenas");

    var launchNotification = function () {
        $cordovaLocalNotification.add({
            id: 1,
            title: 'Allergic Alert',
            text: 'Attention, you are allergic to product X!',
            data: {
                customProperty: 'custom value'
            }
        }).then(function (result) {
                // ...
            });
    };

    $scope.$on('socket:text', function(ev, data){
        $ionicPlatform.ready(function () {

            console.log(data + "aqui");

            launchNotification();
        });

    })

    var userinfo = $localstorage.getObject('userinfo');
    $scope.$on('logged_in', function(ev, data){
        var userinfo1 = $localstorage.getObject('userinfo');
        $scope.userpicture = userinfo1.picture;

    })



    if(userinfo) {
        $scope.username = userinfo.name;
        //$scope.userbirthday = userinfo.birthday;
        $scope.userpicture = userinfo.picture;

    } else {
        $scope.username = 'ARPA';
        $scope.userpicture = './img/logo_arpa.svg';
    }
})

.controller('AllergensCtrl', function($scope, $ionicModal, $localstorage, $http){
    $scope.value_allergies = true;
    $scope.value_intolerances = true;
    $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
    $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";

    var access2 = $localstorage.get('accessibility');
    if(access2 && access2 == 'true'){
        console.log($localstorage.get('accessibility'));
    } else {
        console.log('false');
    }

    var updateDatabase = function(){
        var intolerancesToSend = [];
        var allergensToSend = [];
        var alreadyRegistered = $localstorage.get('alreadyRegistered');

        for(var i = 0; i < $scope.intolerances.length; i++){
            intolerancesToSend.push($scope.intolerances[i].name);
        }

        for(var i = 0; i < $scope.allergens.length; i++){
            allergensToSend.push($scope.allergens[i].name);
        }

        if(!alreadyRegistered){
            $http.post(host + '/' + $localstorage.getObject('userinfo').id, {intolerant: JSON.stringify(intolerancesToSend), allergic: JSON.stringify(allergensToSend)}).
            success(function(data, status, headers, config){
                console.log(data);
                $localstorage.setObject('alreadyRegistered', 'true');
            }).
            error(function(data, status, headers, config){
                console.log("ERROR: " + JSON.stringify(data));
            });
        } else{
            $http.put(host + '/' + $localstorage.getObject('userinfo').id, {intolerant: JSON.stringify(intolerancesToSend), allergic: JSON.stringify(allergensToSend)}).
            success(function(data, status, headers, config){
                console.log(data);
                $localstorage.setObject('alreadyRegistered', 'true');
            }).
            error(function(data, status, headers, config){
                console.log("ERROR: " + JSON.stringify(data));
            });
        }
    };



    $scope.plus_into = function() {
        if ($scope.value_intolerances == true) {
            $scope.value_intolerances = false;
            $scope.extra_icons_intol = "./img/allergens-icons/guardar.svg";
        }else{ //Save
            $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
            $scope.value_intolerances = true;
            updateDatabase();
        }
    };

    $scope.plus_allergs = function() {
        if ($scope.value_allergies == true) {
            $scope.value_allergies = false;
            $scope.extra_icons_allergs = "./img/allergens-icons/guardar.svg";
            //$scope.push_down = {'opacity': "0.6"};
            } else{ //Save
                $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
                $scope.value_allergies = true;
                updateDatabase();
                
            }
        };

        $scope.addAllergens = function($index, $value){
            $scope.not_selected_allergens.splice($index,1);
            $scope.allergens.push($value);
            $localstorage.setObject('allergies', {allergies: $scope.allergens});
        };

        $scope.removeAllergens = function($index, $value) {
            if ($scope.value_allergies != true) {
                $scope.allergens.splice($index,1);
                $scope.not_selected_allergens.unshift($value);
                $localstorage.setObject('allergies', {
                    allergies: $scope.allergens
                });
            }
        };

        $scope.addIntol = function($index, $value){
            $scope.not_selected_intolerances.splice($index,1);
            $scope.intolerances.push($value);
            $localstorage.setObject('intolerances', {
                intolerances: $scope.intolerances
            });
        };

        $scope.removeIntol = function($index, $value){
            if ($scope.value_intolerances != true) {
                $scope.intolerances.splice($index,1);
                $scope.not_selected_intolerances.unshift($value);
                $localstorage.setObject('intolerances', {
                    intolerances: $scope.intolerances
                });
            }

        };

        $scope.onHold = function() {
            var accessibility = $localstorage.get('accessibility');
            if(accessibility && accessibility == 'true'){
                $localstorage.set('accessibility','false');
            } else {
                $localstorage.set('accessibility','true');
            }
            if($localstorage.get('accessibility') == 'true') {
                console.log('Pelos poderes de Greyskull! Eu tenho a acessibilidade!');
            } else {
                console.log('Eu já não tenho a acessibilidade...');
            }
        };

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

        $scope.not_selected_intolerances = $scope.not_selected_allergens.slice(0, $scope.not_selected_allergens.length);

        $scope.allergens = [];

        $scope.intolerances = [];

        var allergiesObject = $localstorage.getObject('allergies');
        var intoleranceObject = $localstorage.getObject('intolerances');

        if(allergiesObject && allergiesObject.allergies) {
           var allergies = allergiesObject.allergies;
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

if(intoleranceObject && intoleranceObject.intolerances) {
   var intolerances = intoleranceObject.intolerances;
   var indexz = 0;
   while(indexz < intolerances.length) {
    if(intolerances[indexz].$$hashKey != null) {
     intolerances[indexz].$$hashKey = null;
 }
 $scope.intolerances.push(intolerances[indexz]);
 for(var j = 0; j < $scope.not_selected_intolerances.length; j++) {
     if(intolerances[indexz].name == $scope.not_selected_intolerances[j].name) {
      $scope.not_selected_intolerances.splice(j,1);
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
                    birthday: date.toLocaleDateString(),
                });
                $window.location.reload();
            }, function (error) {

            });
        });
    };

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
                    birthday: date.toLocaleDateString(),
                    picture: 'http://graph.facebook.com/' + user.id + '/picture?width=270&height=270'
                });
                $scope.$broadcast('logged_in', {});

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

.controller('SelectCtrl', function($state,  $ionicSlideBoxDelegate, $localstorage) {

    var selectCtrl = this;

        /*var firstRun = $localstorage.get('firstRun');

         if (firstRun && firstRun == 'false'){
         $state.go('tab.allergens');

         } else {
         selectCtrl.$on('$ionicView.enter', function() {
         $ionicSlideBoxDelegate.slide(0);
         $localstorage.set('firstRun', 'false');
         });
}*/

        // Called to navigate to the main app
        selectCtrl.startApp = function() {
            $state.go('tab.allergens');

        };
        selectCtrl.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        selectCtrl.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        selectCtrl.slideChanged = function(index) {
            selectCtrl.slideIndex = index;
        };
    });
