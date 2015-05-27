var host = "http://localhost:3000/allergies";
var herokuHost = "http://arpa.herokuapp.com/allergies";

angular.module('arpa.controllers', [])


.controller('AppsCtrl', function($scope) {})

.controller('MainCtrl', function($ionicPlatform, $scope, $localstorage, $http, Socket, $cordovaLocalNotification, $cordovaMedia, $accessibility){
    $scope.userpicture = './img/logo_arpa.svg';

    Socket.forward('notification', $scope);
    console.log("cenas");
    if(!($localstorage.get('language')) || $localstorage.get('language') == null) {
        $localstorage.set('language', 'pt');
    }
    $localstorage.set('voice', 'f');

    $scope.activateAccessibility = function(value){
        var status_accessibility = $localstorage.get('accessibility');
        if(status_accessibility == 'true') {
            console.log('Desligar acessibilidade.');
            $localstorage.set('accessibility','false');
        } else if(status_accessibility == 'false') {
            console.log('Ligar acessibilidade');
            $localstorage.set('accessibility','true');
        }
    }

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

    $scope.$on('socket:notification', function(ev, data){
        $ionicPlatform.ready(function () {

            console.log(data + " TAG aqui");

            launchNotification();
        });

    })

    var userinfo = $localstorage.getObject('userinfo');

    $scope.$on('logged_in', function(ev, data){
        $scope.userpicture = $localstorage.getObject('userinfo').picture;
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

.controller('AllergensCtrl', function($scope, $ionicPlatform, $ionicModal, $localstorage, $http, $cordovaMedia){

    $scope.value_allergies = true;
    $scope.value_intolerances = true;
    $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
    $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";

    var access = $localstorage.get('accessibility');
    if(access && access == 'true'){
        $ionicPlatform.ready(function(){
            if(typeof cordova != "undefined"){
                var media = $accessibility.getVoice(2);
                media.play();
            }
        });
    } else {
        $localstorage.set('accessibility', 'false');
        console.log('Desligado');
    }

    $scope.allergySymbol = "fakeclass";
    $scope.intoleranceSymbol = "fakeclass";

    var updateDatabase = function(){
        var intolerancesToSend = [];
        var allergensToSend = [];

        for(var i = 0; i < $scope.intolerances.length; i++){
            intolerancesToSend.push($scope.intolerances[i].name);
        }

        for(var i = 0; i < $scope.allergens.length; i++){
            allergensToSend.push($scope.allergens[i].name);
        }
/*
        $http.get(herokuHost + '/' + $localstorage.getObject('userinfo').id).
        success(function(data, status, headers, config){
            $http.put(herokuHost + '/' + $localstorage.getObject('userinfo').id, {intolerant: JSON.stringify(intolerancesToSend), allergic: JSON.stringify(allergensToSend)}).
            success(function(data, status, headers, config){
                console.log(data);
            }).
            error(function(data, status, headers, config){
                console.log("ERROR: " + JSON.stringify(data));
            });
        }).
        error(function(data, status, headers, config){
            if(data === ""){
                $http.post(herokuHost + '/' + $localstorage.getObject('userinfo').id, {intolerant: JSON.stringify(intolerancesToSend), allergic: JSON.stringify(allergensToSend)}).
                success(function(data, status, headers, config){
                    console.log(data);
                }).
                error(function(data, status, headers, config){
                    console.log("ERROR: " + JSON.stringify(data));
                });
            }
            else{
                console.log("ERROR: " + data);
            }
        });*/
    };


    $scope.plus_into = function() {
        if ($scope.value_intolerances == true) {
            $scope.value_intolerances = false;
            $scope.extra_icons_intol = "./img/allergens-icons/guardar.svg";
            
            $scope.intoleranceSymbol = "intolerance-symbol";
        } else { //Save
            $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
            $scope.value_intolerances = true;
            $scope.intoleranceSymbol = "fakeclass";

            updateDatabase();
        }
    };

        $scope.plus_allergs = function() {
            if ($scope.value_allergies == true) {
                $scope.value_allergies = false;
                $scope.extra_icons_allergs = "./img/allergens-icons/guardar.svg";

                $scope.allergySymbol = "allergy-symbol";
            } else { //Save
                $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
                $scope.value_allergies = true;
                $scope.allergySymbol = "fakeclass";

                updateDatabase();
            }
        };

        $scope.addAllergens = function($index, $value){
            $scope.not_selected_allergens.splice($index,1);
            $scope.allergens.push($value);
            $scope.not_selected_intolerances.splice($scope.not_selected_intolerances.indexOf($value), 1);
            $localstorage.setObject('allergies', {allergies: $scope.allergens});
        };

        $scope.removeAllergens = function($index, $value) {
            if ($scope.value_allergies != true) {
                $scope.allergens.splice($index,1);
                $scope.not_selected_allergens.unshift($value);
                $scope.not_selected_intolerances.unshift($value);
                $localstorage.setObject('allergies', {
                    allergies: $scope.allergens
                });
            }
        };

        $scope.addIntol = function($index, $value){
            $scope.not_selected_intolerances.splice($index,1);
            $scope.intolerances.push($value);
            $scope.not_selected_allergens.splice($scope.not_selected_allergens.indexOf($value), 1);
            $localstorage.setObject('intolerances', {intolerances: $scope.intolerances});
        };

        $scope.removeIntol = function($index, $value){
            if ($scope.value_intolerances != true) {
                $scope.intolerances.splice($index,1);
                $scope.not_selected_intolerances.unshift($value);
                $scope.not_selected_allergens.unshift($value);
                $localstorage.setObject('intolerances', {
                    intolerances: $scope.intolerances
                });
            }

        };



        $scope.onHold = function() {

        };

        $scope.not_selected_allergens = $localstorage.getAllergens();
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
                        $scope.not_selected_intolerances.splice(i,1);
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
                        for(var i = 0; i < $scope.not_selected_allergens.length; i++){
                            if($scope.not_selected_allergens[i].name == intolerances[indexz].name){
                                $scope.not_selected_allergens.splice(i, 1);
                            }
                        }
                    }
                }
                indexz++;
            }
        }

    })
    
.controller('ProfileCtrl', function($scope) {
    $scope.myActiveSlide = 1;
})

.controller('DefinitionsCtrl', function($http, $scope, $state, $localstorage, $window, $ionicModal, $cordovaFacebook) {
    $scope.sign_in_hide = false;

    var getFromDb = function(id, callback){
        $http.get(herokuHost + '/' + id).
        success(function(result, status, headers, config){
            console.log("TAG RESULT : " + JSON.stringify(result.data));
            $scope.allergens = [];
            $scope.intolerances = [];
            $localstorage.matchFromDb(result.data.allergic, $scope.allergens);
            $localstorage.matchFromDb(result.data.intolerant, $scope.intolerances);
            $localstorage.setObject('allergies', {
                allergies: $scope.allergens
            });
            $localstorage.setObject('intolerances', {
                intolerances: $scope.intolerances
            });
            callback();
        }).
        error(function(result, status, headers, config){
            console.log("TAG ERROR: " + result.data);
            callback();
        })
    };

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
                getFromDb(user.id, function(){
                    $window.location.reload();
                });
                $scope.$broadcast('logged_in', {});
            }, function (error) {

            });

        }, function(error){

        });
    };
    $scope.logout = function(){
        $localstorage.setObject('userinfo',null);
        $window.location.reload();
    }
        $scope.languages = [
            { text: 'English', value: 1 },
            { text: 'Português', value: 2 }
        ];
        $scope.changeLanguage = function(id){
            window.alert('Old Value: ' + $localstorage.get('language') + ' New Value: ' + id);
            $localstorage.set('language', id);

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
    var firstRun = $localstorage.get('firstRun');

    if (firstRun && firstRun == 'false'){
        $state.go('tab.allergens');

    } else {
        /*selectCtrl.$on('$ionicView.enter', function() {
            $ionicSlideBoxDelegate.slide(0);
            $localstorage.set('firstRun', 'false');
        });*/
    }

    selectCtrl.slideIndex = 0;
    selectCtrl.showPager = true;

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

        if (index == 2) {
            selectCtrl.showPager = false;

            var video = document.getElementById("video1");
            video.load();
            video.play();
        } else if (index == 3) {
            selectCtrl.showPager = false;

            var video = document.getElementById("video2");
            video.load();
            video.play();
        } else {
            selectCtrl.showPager = true;
        }
    };
});
