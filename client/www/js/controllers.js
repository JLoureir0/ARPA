var host = "http://localhost:3000/allergies";
var herokuHost = "http://arpa.herokuapp.com/allergies";

angular.module('arpa.controllers', [])


.controller('AppsCtrl', function($scope) {})

.controller('MainCtrl', function($ionicPlatform, $scope, $localstorage, $http, Socket, $cordovaLocalNotification, $cordovaMedia, $accessibility, $timeout, $rootScope){
    $scope.userpicture = './img/logo_arpa.svg';

    Socket.forward('notification', $scope);
    Socket.on('connection',function(){
        $ionicPlatform.ready(function () {
            var id = device.uuid;
            console.log(device.uuid);
            Socket.emit('device_id', id);
        });
    });

    $accessibility.loadOptions();

    $scope.activateAccessibility = function(value){
        $accessibility.toggleAccessibility();
        var access = $localstorage.get('accessibility');
        var sound;
        if(access && access == 'true') {
            sound = $accessibility.getVoice(1);
        } else {
            sound = $accessibility.getVoice(0);
        }
        if(sound && sound != null && sound != undefined) {
            $ionicPlatform.ready(function() {
                if(typeof cordova != "undefined") {
                  $rootScope.$broadcast('playing');
                  sound.play();
                  $scope.$on('playing', function() {
                      sound.stop();
                  });
              }
          });
        }
        $timeout(function() {
            $ionicPlatform.ready(function(){
                if(typeof cordova != "undefined"){
                    if(access && access == 'true') {
                        var thissound = $accessibility.getVoice(value);
                        if(thissound && thissound != null && thissound != undefined) {
                            $rootScope.$broadcast('playing');
                            thissound.play();
                            $scope.$on('playing', function() {
                                thissound.stop();
                            });
                        }
                    } else {
                        $rootScope.$broadcast('playing');
                    }
                }
            });
        },3000);
    }

    var launchNotification = function (req) {

        console.log(req.product);
        $cordovaLocalNotification.add({
            id: 1,
            title: 'Allergic Alert',
            text: 'Attention, you are allergic to ' + req.product +' (' + req.tag + ')!',
            data: {
                customProperty: 'custom value'
            }
        }).then(function (result) {
            var access = $localstorage.get('accessibility');
            if(access && access == 'true') {
                $ionicPlatform.ready(function(){
                    if(typeof cordova != "undefined"){
                        var alertsound = $accessibility.getVoice(5);
                        if(alertsound && alertsound != null && alertsound != undefined) {
                            $rootScope.$broadcast('playing');
                            alertsound.play();
                        }
                    }
                });
            }
        });
    };

    $scope.$on('socket:notification', function(ev, data){
        $ionicPlatform.ready(function () {
            console.log(data.tag);
            var parsed = $localstorage.parseAllergen(""+data.tag+"");
            var toNotify = {product: data.name, tag: parsed};
            launchNotification(toNotify);
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

.controller('AllergensCtrl', function($scope, $ionicPlatform, $ionicModal, $localstorage, $http, $cordovaMedia, $accessibility, $rootScope){

    $scope.value_allergies = true;
    $scope.value_intolerances = true;
    $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
    $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
    $scope.editAllergens = "Editar";
    $scope.editIntolerances = "Editar";
    $scope.activeLanguage = "pt";

    $scope.$on('changeLanguageEn', function(ev, data){

        $scope.editAllergens = 'Edit';
        $scope.editIntolerances = 'Edit';
        $scope.activeLanguage = "en";
        var translatedAllergens = $localstorage.getAllergensEn();
                //Changing selected allergens
                for(var i=0; i<$scope.allergens.length;i++){
                    for(var j=0; j<translatedAllergens.length; j++){
                        if($scope.allergens[i].id==translatedAllergens[j].id){
                            $scope.allergens.splice(i,1);
                            $scope.allergens.splice(i,0,translatedAllergens[j]);
                        }
                    }
                }
            //Changing unselected allergens
            for(var i=0; i<$scope.not_selected_allergens.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.not_selected_allergens[i].id==translatedAllergens[j].id){
                        $scope.not_selected_allergens.splice(i,1);
                        $scope.not_selected_allergens.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
            //------------------------------------------------------------------------------
            //Changing selected intolerances
            for(var i=0; i<$scope.intolerances.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.intolerances[i].id==translatedAllergens[j].id){
                        $scope.intolerances.splice(i,1);
                        $scope.intolerances.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
            //Changing unselected allergens
            for(var i=0; i<$scope.not_selected_intolerances.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.not_selected_intolerances[i].id==translatedAllergens[j].id){
                        $scope.not_selected_intolerances.splice(i,1);
                        $scope.not_selected_intolerances.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
        })
$scope.$on('changeLanguagePt', function(ev, data){

    $scope.editAllergens = 'Editar';
    $scope.editIntolerances = 'Editar';
    $scope.activeLanguage = "pt";
    var translatedAllergens = $localstorage.getAllergensPt();
            //Changing selected allergens
            for(var i=0; i<$scope.allergens.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.allergens[i].id==translatedAllergens[j].id){
                        $scope.allergens.splice(i,1);
                        $scope.allergens.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
            //Changing unselected allergens
            for(var i=0; i<$scope.not_selected_allergens.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.not_selected_allergens[i].id==translatedAllergens[j].id){
                        $scope.not_selected_allergens.splice(i,1);
                        $scope.not_selected_allergens.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
            //------------------------------------------------------------------------------
            //Changing selected intolerances
            for(var i=0; i<$scope.intolerances.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.intolerances[i].id==translatedAllergens[j].id){
                        $scope.intolerances.splice(i,1);
                        $scope.intolerances.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
            //Changing unselected allergens
            for(var i=0; i<$scope.not_selected_intolerances.length;i++){
                for(var j=0; j<translatedAllergens.length; j++){
                    if($scope.not_selected_intolerances[i].id==translatedAllergens[j].id){
                        $scope.not_selected_intolerances.splice(i,1);
                        $scope.not_selected_intolerances.splice(i,0,translatedAllergens[j]);
                    }
                }
            }
        })

$scope.$on("$ionicView.enter", function () {
    var access = $localstorage.get('accessibility');
    if(access && access == 'true'){
        $ionicPlatform.ready(function(){
            if(typeof cordova != "undefined"){
                var media = $accessibility.getVoice(2);
                if(media != null) {
                    $rootScope.$broadcast('playing');
                    media.play();
                    $scope.$on('playing', function() {
                        media.stop();
                    });
                }
            }
        });
    } else {
        $localstorage.set('accessibility', 'false');
    }
});

$scope.allergySymbol = "fakeclass";
$scope.intoleranceSymbol = "fakeclass";

var updateDatabase = function(){
    var intolerancesToSend = [];
    var allergensToSend = [];
    var objectToSend = {};

    objectToSend.deviceId = device.uuid;


    if($localstorage.getObject('userinfo') != null){
        console.log("FOUND USERINFO: " +  JSON.stringify($localstorage.getObject('userinfo')));
        objectToSend.fbId = $localstorage.getObject('userinfo').id;
    } else{
        console.log("NOT FOUND USERINFO");
                objectToSend.fbId = '0'; //FbID = 0 -> Running local account for the first time
            }

            if($localstorage.get('appId') != null && $localstorage.get('appId') != ''){
                objectToSend.appId = $localstorage.get('appId');
            }

            for(var i = 0; i < $scope.intolerances.length; i++){
                intolerancesToSend.push($scope.intolerances[i].name.toLowerCase());
            }

            for(var i = 0; i < $scope.allergens.length; i++){
                allergensToSend.push($scope.allergens[i].name.toLowerCase());
            }

            objectToSend.intolerant = JSON.stringify(intolerancesToSend);
            objectToSend.allergic = JSON.stringify(allergensToSend);
            console.log(JSON.stringify(objectToSend));

            $http.post(herokuHost + '/', objectToSend).
            success(function(result, status, headers, config){
                console.log(result.data);
                    if($localstorage.getObject('userinfo') == null){ //Local Account, save the new ID
                        $localstorage.set('appId', result.data)
                    }
                }).
            error(function(result, status, headers, config){
                console.log("ERROR: " + JSON.stringify(result));
            });

        };


        $scope.plus_into = function() {
            if ($scope.value_intolerances == true) {
                $scope.value_intolerances = false;
                $scope.extra_icons_intol = "./img/allergens-icons/guardar.svg";

                $scope.intoleranceSymbol = "intolerance-symbol";
                if($scope.activeLanguage=='pt') {
                    $scope.editIntolerances = "Guardar";
                }else{
                    if($scope.activeLanguage=='en'){
                        $scope.editIntolerances = "Save";
                    }
                }
            } else { //Save
                $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
                $scope.value_intolerances = true;
                $scope.intoleranceSymbol = "fakeclass";

                updateDatabase();
                if($scope.activeLanguage=='pt') {
                    $scope.editIntolerances = "Editar";
                }else{
                    if($scope.activeLanguage=='en'){
                        $scope.editIntolerances = "Edit";
                    }
                }
            }
        };

        $scope.plus_allergs = function() {
            if ($scope.value_allergies == true) {
                $scope.value_allergies = false;
                $scope.extra_icons_allergs = "./img/allergens-icons/guardar.svg";

                $scope.allergySymbol = "allergy-symbol";

                if($scope.activeLanguage=='pt') {
                    $scope.editAllergens = "Guardar";
                }else{
                    if($scope.activeLanguage=='en'){
                        $scope.editAllergens = "Save";
                    }
                }
            } else { //Save
                $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
                $scope.value_allergies = true;
                $scope.allergySymbol = "fakeclass";

                updateDatabase();
                if($scope.activeLanguage=='pt') {
                    $scope.editAllergens = "Editar";
                }else{
                    if($scope.activeLanguage=='en'){
                        $scope.editAllergens = "Edit";
                    }
                }
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

        $scope.not_selected_allergens = $localstorage.getAllergensPt();
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

.controller('ApplicationsCtrl', function($scope, $localstorage, $ionicPlatform, $cordovaMedia, $accessibility, $rootScope) {

    $scope.applicationsList = [
    {
        app: "Continente Mobile",
                checked: false  //fix connection
            },
            {
                app: "Farmácia Mobile",
                checked: false
            }
            ];


            $scope.$on("$ionicView.enter", function () {
                var access = $localstorage.get('accessibility');
                if(access && access == 'true'){
                    $ionicPlatform.ready(function(){
                        if(typeof cordova != "undefined"){
                            var media = $accessibility.getVoice(3);
                            if(media != null) {
                                $rootScope.$broadcast('playing');
                                media.play();
                                $scope.$on('playing', function() {
                                    media.stop();
                                });
                            }
                        }
                    });
                } else {
                    $localstorage.set('accessibility', 'false');
                }
            });
        })


.controller('DefinitionsCtrl', function($http, $scope, $rootScope, $state, $localstorage, $window, $ionicModal, $cordovaFacebook, $accessibility, $cordovaMedia, $ionicPlatform, $translate, $rootScope) {
    $scope.sign_in_hide = false;

    $scope.$on("$ionicView.enter", function () {
        var access = $localstorage.get('accessibility');
        if(access && access == 'true'){
            $ionicPlatform.ready(function(){
                if(typeof cordova != "undefined"){
                    var media = $accessibility.getVoice(4);
                    if(media != null) {
                        $rootScope.$broadcast('playing');
                        media.play();
                        $scope.$on('playing', function() {
                            media.stop();
                        });
                    }
                }
            });
        } else {
            $localstorage.set('accessibility', 'false');
        }
    });

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
                            $localstorage.set('appId', ''); //Facebook login, hence new account, forget appID
                            getFromDb(user.id, function(){
                                $window.location.reload();
                            });
                            $scope.$broadcast('logged_in', {});
                        }, function (error) {

                        });

        }, function(error){

        });
    };

    $scope.recognition = new SpeechRecognition();
    $scope.recognition.onresult = function(event) {
      if (event.results.length > 0) {
        var value = event.results[0][0].transcript;
        console.log("I HEARD " + value);
    }
};
$scope.logout = function(){
    $localstorage.setObject('userinfo',null);
    $window.location.reload();
}
$scope.languages = [
{ text: 'English', value: 1 },
{ text: 'Português', value: 2 }
];
$scope.changeLanguage = function(lid){
    $accessibility.setLanguage(lid);
    var access = $localstorage.get('accessibility');
    if(access && access == 'true') {
        $ionicPlatform.ready(function(){
            if(typeof cordova != "undefined"){
              var sound = $accessibility.getVoice(6);
              if(sound && sound != null && sound != undefined) {
                $rootScope.$broadcast('playing');
                sound.play();
                $scope.$on('playing', function() {
                    sound.stop();
                });
            }
        }
    });
    } else {
        if(lid=='pt'){
            $translate.use('pt');
            $rootScope.$broadcast('changeLanguagePt', {});
            alert("Linguagem alterada para Português!");
        }else{
            if(lid=='en'){
                $translate.use('en');
                $rootScope.$broadcast('changeLanguageEn', {});
                alert("Language changed to English!");

            }

        }
    }

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
        var newID = '_' + Math.random().toString(36).substr(2, 9);
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
