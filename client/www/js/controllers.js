var host = "http://localhost:3000/allergies";
var herokuHost = "http://arpa.herokuapp.com/allergies";

angular.module('arpa.controllers', [])


    .controller('AppsCtrl', function($scope) {})

    .controller('MainCtrl', function($ionicPlatform, $scope, $state, $localstorage, $cordovaFacebook, $http, $translate, Socket, $cordovaLocalNotification, $cordovaMedia, $cordovaToast, $accessibility, $timeout, $rootScope){
        $scope.userpicture = './img/logo_arpa.svg';

        var notifications = $localstorage.get('notifications');
        if(!(notifications) || notifications == undefined || notifications == null) {
            $localstorage.set('notifications','true');
        }

        $accessibility.loadOptions();



        Socket.forward('notification', $scope);

        Socket.on('connection',function(){
            $ionicPlatform.ready(function () {
                var id = device.uuid;
                console.log(device.uuid);
                Socket.emit('device_id', id);
            });
        });

        $ionicPlatform.ready(function(){
            if (typeof SpeechRecognition === 'function') {
                $scope.recognition = new SpeechRecognition();
                $scope.recognition.onresult = function(event) {
                    console.log("aqui");
                    if (event.results.length > 0) {
                        var value = event.results[0][0].transcript;

                        if(value == 'login'){
                            $scope.fbLogin();
                        }
                        else if(value == 'logout'){
                            $scope.logout();
                        }
                        else if(value.indexOf('allergy') >= 0){

                            if(value.indexOf('at') >= 0 || value.indexOf('add') >= 0 || value.indexOf('as') >= 0){
                                var res = value.split(" ");
                                if(res.length == 3) {

                                    var allergen = res[2];
                                    var args = {
                                        allergen: allergen
                                    }
                                    $rootScope.$broadcast('add_allergy', args);
                                }
                                else
                                    $cordovaToast.showShortBottom("Command not recognized! Try 'Add allergy *allergy*' ");
                            }
                            else if(value.indexOf('delete') >= 0 || value.indexOf('remove') >= 0){

                                var res = value.split(" ");
                                if(res.length == 3) {

                                    var allergen = res[2];
                                    var args = {
                                        allergen: allergen
                                    }
                                    $rootScope.$broadcast('delete_allergy', args);
                                }
                                else
                                    $cordovaToast.showShortBottom("Command not recognized! Try 'Delete allergy *allergy*' ");
                            }
                        }
                        else if(value.indexOf('language') >= 0) {
                            var res = value.split(" ");
                            if (value.indexOf('change') >= 0) {
                                if (res.length == 3) {

                                    var language = res[2];
                                    var args = {
                                        lang: language
                                    }
                                    if(language == 'Portuguese') {
                                        changeLang('pt');
                                    }
                                    else if(language == 'English')
                                        changeLang('en');
                                }
                            }
                            else
                                $cordovaToast.showShortBottom("Command not recognized! Try 'Change language *language*' ");
                        }
                        else
                            $cordovaToast.showShortBottom("Command not recognized!");
                    }

                    else
                        $cordovaToast.showShortBottom("Command not recognized!");
                }
            }
        });

        var changeLang = function(lid){
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
                    $cordovaToast.showShortBottom("Linguagem alterada para Português!");
                }else{
                    if(lid=='en'){
                        $translate.use('en');
                        $rootScope.$broadcast('changeLanguageEn', {});
                        $cordovaToast.showShortBottom("Language changed to English!");

                    }

                }
            }

        };
        $scope.changeLanguage = function(lid){
            changeLang(lid);
        }


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
                            console.log("TAG ID = " + user.id);
                            $localstorage.setObject('userinfo', {
                                id: $scope.user.id,
                                name: $scope.user.name,
                                birthday: date.toLocaleDateString(),
                                picture: 'http://graph.facebook.com/' + user.id + '/picture?width=270&height=270'
                            });
                            $localstorage.set('appId', ''); //Facebook login, hence new account, forget appID
                            getFromDb(user.id, function(){
                                $scope.userpicture = $localstorage.getObject('userinfo').picture;
                                checkUser();
                                $rootScope.$broadcast('killFbModal', {});
                                $rootScope.$broadcast('logged_in', {});
                                $cordovaToast.showShortBottom("Logged in!");
                            });
                        }, function (error) {

                        });

                }, function(error){

                });
        };


        $scope.logout = function(){
            $localstorage.setObject('userinfo',null);
            checkUser();
            $cordovaToast.showShortBottom("Logged out!");
        }

        $accessibility.loadOptions();
        if($localstorage.getObject('language').id == 'pt'){
            $translate.use('pt')
        }
        else
            $translate.use('en');

        var checkUser = function(){
            var userinfo = $localstorage.getObject('userinfo');


            if(userinfo) {
                console.log("TAG USER FOUND");
                $scope.username = userinfo.name;
                $scope.userpicture = userinfo.picture;
            } else {
                console.log("TAG USER NOT FOUND");
                $scope.username = 'ARPA';
                $scope.userpicture = './img/logo_arpa.svg';
            }
        };

        $scope.activateAccessibility = function(value){
            $accessibility.toggleAccessibility();
            var access = $localstorage.get('accessibility');
            var sound;
            if(access && access == 'true') {
                $cordovaToast.showShortBottom("Accessibility Mode Activated!");
                sound = $accessibility.getVoice(1);
            } else {
                $cordovaToast.showShortBottom("Accessibility Mode Deactivated!");
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
            },2500);
        }
        var i = 1;
        var launchNotification = function (req) {

            console.log(req.product);
            $cordovaLocalNotification.add({
                id: i++,
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

        checkUser();
    })

    .controller('AllergensCtrl', function($scope, $translate, $ionicPlatform, $ionicModal, $localstorage, $http, $cordovaMedia, $accessibility, $rootScope, $cordovaToast, $ionicScrollDelegate){

        $scope.value_allergies = true;
        $scope.value_intolerances = true;
        $scope.extra_icons_intol = "./img/allergens-icons/mais.svg";
        $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
        $scope.editAllergens = "Edit";
        $scope.editIntolerances = "Edit";
        $scope.activeLanguage = "en";

        $scope.$on('logged_in', function(ev, data){
            console.log("TAG LOGGED IN @ ALLERGENS");
            updateAllergies();
        })

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

        var findIndexObject = function(array, Object){
            for(var i = 0; i< array.length; i++){
                console.log(array[i].id);
                console.log(Object.id);
                if(array[i].id === Object.id){
                    console.log("deu");
                    return i;
                }
            }
            return -1;
        }

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
                if($localstorage.getObject('language').id == 'en')
                {
                    var translated = $localstorage.translateAllergen($scope.intolerances[i].name.toLowerCase(), 'pt')
                    intolerancesToSend.push(translated.name.toLowerCase());
                }
                else
                    intolerancesToSend.push($scope.intolerances[i].name.toLowerCase());
            }

            for(var i = 0; i < $scope.allergens.length; i++){
                if($localstorage.getObject('language').id == 'en')
                {
                    var translated = $localstorage.translateAllergen($scope.allergens[i].name.toLowerCase(), 'pt');
                    console.log("tranlasta: " + translated.name);
                    allergensToSend.push(translated.name.toLowerCase());
                }
                else
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


        $scope.$on('add_allergy', function(event, args){
            var allergenEn = args.allergen;
            var allergen = $localstorage.translateAllergen(allergenEn, 'pt');

            if(allergen != undefined) {
                var $index = findIndexObject($scope.not_selected_allergens, allergen);
                console.log("ind " + $index); //not being found
                $scope.not_selected_allergens.splice($index, 1);
                $scope.allergens.push(allergen);
                $scope.not_selected_intolerances.splice(findIndexObject($scope.not_selected_intolerances, allergen), 1);
                $localstorage.setObject('allergies', {allergies: $scope.allergens});
                updateDatabase();
                if($localstorage.getObject('language').id == 'en') {
                    $rootScope.$broadcast('changeLanguageEn', {});
                }
                $cordovaToast.showShortBottom("Allergy added!");
            }
        })

        $scope.$on('delete_allergy', function(event, args){
            var allergenEn = args.allergen;
            var allergensEn = $localstorage.getAllergensEn();
            var allergen;

            for(var j = 0; j < allergensEn.length; j++){
                console.log(allergenEn);
                console.log(allergensEn[j].name.toLowerCase());
                if(allergenEn == allergensEn[j].name.toLowerCase()){
                    allergen = allergensEn[j];
                }
            }

            if(allergen != undefined) {
                var $index = findIndexObject($scope.allergens, allergen);
                if ($index >= 0) {

                    $scope.allergens.splice($index, 1);
                    $scope.not_selected_allergens.unshift(allergen);
                    $scope.not_selected_intolerances.unshift(allergen);
                    $localstorage.setObject('allergies', {
                        allergies: $scope.allergens
                    });
                    updateDatabase();
                    if ($localstorage.getObject('language').id == 'en') {
                        $rootScope.$broadcast('changeLanguageEn', {});
                    }
                    $cordovaToast.showShortBottom("Allergy deleted!");
                }
            }
        })


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

                if($scope.activeLanguage=='pt') {
                    $scope.editIntolerances = "Editar";
                }else{
                    if($scope.activeLanguage=='en'){
                        $scope.editIntolerances = "Edit";
                    }
                }

                $localstorage.setObject('intolerances', {intolerances: $scope.intolerances});

                updateDatabase();
                $cordovaToast.showShortBottom("Updated Intolerances!");
            }
            $ionicScrollDelegate.$getByHandle('allergyScroll').resize();
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

                if($scope.activeLanguage=='pt') {
                    $scope.editAllergens = "Editar";
                }else{
                    if($scope.activeLanguage=='en'){
                        $scope.editAllergens = "Edit";
                    }
                }


                $localstorage.setObject('allergies', {allergies: $scope.allergens});
                updateDatabase();
                $cordovaToast.showShortBottom("Updated Allergies!");
            }
            $ionicScrollDelegate.$getByHandle('allergyScroll').resize();
        };

        $scope.addAllergens = function($index, $value){
            $scope.not_selected_allergens.splice($index,1);
            $scope.allergens.push($value);
            $scope.not_selected_intolerances.splice($scope.not_selected_intolerances.indexOf($value), 1);
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


        var updateAllergies = function(){
            $scope.not_selected_allergens = $localstorage.getAllergensPt();
            $scope.not_selected_intolerances = $scope.not_selected_allergens.slice(0, $scope.not_selected_allergens.length);

            $scope.allergens = [];

            $scope.intolerances = [];

            var allergiesObject = $localstorage.getObject('allergies');
            var intoleranceObject = $localstorage.getObject('intolerances');

            console.log("TAG ALLERGIES ON BEGGINING: " + JSON.stringify(allergiesObject));
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
            if($localstorage.getObject('language').id == 'en') {
                console.log("broad");
                $rootScope.$broadcast('changeLanguageEn', {});
            }
        };

        updateAllergies();
    })

    .controller('ProfileCtrl', function($scope) {
        $scope.myActiveSlide = 1;
    })

    .controller('ApplicationsCtrl', function($scope, $localstorage, $ionicPlatform, $cordovaMedia, $accessibility, $rootScope, $cordovaToast) {

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


    .controller('DefinitionsCtrl', function($http, $scope, $rootScope, $ionicPopup, $state, $localstorage, $window, $ionicModal, $cordovaToast, $accessibility, $cordovaMedia, $ionicPlatform, $translate) {
        $scope.sign_in_hide = false;

        $scope.notificationstoggle = $localstorage.get('notifications') === 'true';

        $scope.toggleNotifications = function () {
            $localstorage.set('notifications','true');
        };

        $scope.$on('killFbModal', function(ev, data){
            $ionicPlatform.ready(function () {
                $scope.modal.remove();
            });

        })

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

        $scope.languages = [
            { text: 'English', value: 'en' },
            { text: 'Português', value: 'pt' }
        ];





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
