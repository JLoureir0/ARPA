angular.module('arpa.services', [])

    .factory('$localstorage', ['$window', function($window) {
      return {
        set: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          if($window.localStorage[key]){
            return $window.localStorage[key];
          } else{
            return null;
          }
        },
        setObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
          if($window.localStorage[key]){
            return JSON.parse($window.localStorage[key]);
          } else {
            return null;
          }

        },
        getAllergensPt: function(){
          var allergens = [
            {
              id: 1,
              name: "Lacteos",
              src: "./img/allergens-icons/lacteos.svg"
            },
            {
              id: 2,
              name: "Gluten",
              src: "./img/allergens-icons/gluten.svg"
            },
            {
              id: 3,
              name: "Amendoins",
              src: "./img/allergens-icons/amendoins.svg"
            },
            {
              id: 4,
              name: "Ovos",
              src: "./img/allergens-icons/ovos.svg"
            },
            {
              id: 5,
              name: "Marisco",
              src: "./img/allergens-icons/marisco.svg"
            },
            {
              id: 6,
              name: "Moluscos",
              src: "./img/allergens-icons/moluscos.svg"
            },
            {
              id: 7,
              name: "Mostarda",
              src: "./img/allergens-icons/mostarda.svg"
            },
            {
              id: 8,
              name: "Peixe",
              src: "./img/allergens-icons/peixe.svg"
            },
            {
              id: 9,
              name: "Sesamo",
              src: "./img/allergens-icons/sesamo.svg"
            },
            {
              id: 10,
              name: "SO2",
              src: "./img/allergens-icons/so2.svg"
            },
            {
              id: 11,
              name: "Soja",
              src: "./img/allergens-icons/soja.svg"
            },
            {
              id: 12,
              name: "Tremocos",
              src: "./img/allergens-icons/tremocos.svg"
            }
          ];

          return allergens.slice(0, allergens.length);
        },

        getAllergensEn: function(){
          var allergens = [
            {
              id: 1,
              name: "Dairy",
              src: "./img/allergens-icons/lacteos.svg"
            },
            {
              id: 2,
              name: "Gluten",
              src: "./img/allergens-icons/gluten.svg"
            },
            {
              id: 3,
              name: "Peanuts",
              src: "./img/allergens-icons/amendoins.svg"
            },
            {
              id: 4,
              name: "Eggs",
              src: "./img/allergens-icons/ovos.svg"
            },
            {
              id: 5,
              name: "Shellfish",
              src: "./img/allergens-icons/marisco.svg"
            },
            {
              id: 6,
              name: "Molluscs",
              src: "./img/allergens-icons/moluscos.svg"
            },
            {
              id: 7,
              name: "Mustard",
              src: "./img/allergens-icons/mostarda.svg"
            },
            {
              id: 8,
              name: "Fish",
              src: "./img/allergens-icons/peixe.svg"
            },
            {
              id: 9,
              name: "Sesame",
              src: "./img/allergens-icons/sesamo.svg"
            },
            {
              id: 10,
              name: "SO2",
              src: "./img/allergens-icons/so2.svg"
            },
            {
              id: 11,
              name: "Soy",
              src: "./img/allergens-icons/soja.svg"
            },
            {
              id: 12,
              name: "Lupins",
              src: "./img/allergens-icons/tremocos.svg"
            }
          ];

          return allergens.slice(0, allergens.length);
        },

        matchFromDb: function(array, result){
          var allergens = this.getAllergensPt();

          for(var i = 0; i < array.length; i++){
            for(var j = 0; j < allergens.length; j++){
              if(array[i] === allergens[j].name.toLowerCase()){
                result.push({id: allergens[j].id, name: allergens[j].name, src: allergens[j].src});
              }
            }
          }
        },

        translateAllergen: function(allergen, toLanguage){
          if(toLanguage == 'pt'){
            var allergensEn = this.getAllergensEn();
            var allergensPt = this.getAllergensPt();

            console.log("rec: " + allergen);
            for(var j = 0; j < allergensEn.length; j++){
              if(allergen == allergensEn[j].name.toLowerCase()){
                return allergensPt[j];
              }
            }

            for(var j = 0; j < allergensPt.length; j++){
              if(allergen == allergensPt[j].name.toLowerCase()){
                return allergensPt[j];
              }
            }

            return undefined;

          }
        },

        parseAllergen: function(allergen){
          console.log(allergen);
          var allergens = this.getAllergensPt();
          for(var i = 0; i < allergens.length; i++){
            if(allergens[i].name.toLowerCase() == allergen){
              return allergens[i].name;
            }
          }

          return "not found";
        }
      }
    }])

    .factory('Socket', function(socketFactory){

       var myIoSocket = io.connect('http://arpa.herokuapp.com');
      /*var myIoSocket = io.connect('http://192.168.56.1:3000');*/
      /*var myIoSocket = io.connect('http://localhost:3000');*/

      var Socket = socketFactory({
        ioSocket: myIoSocket
      })

      return Socket;
    })

    .factory('$accessibility', function($ionicPlatform, $cordovaMedia, $localstorage, $rootScope) {

      var id = ['off','on','allergies','applications','definitions','allergic','language'];

      return {
        getVoice: function(value) {
          var media;
          $ionicPlatform.ready(function(){
            if(typeof cordova != "undefined"){
              var src;
              var languageoptions = $localstorage.getObject('language');
              if(languageoptions && languageoptions != null) {
                src = cordova.file.applicationDirectory + 'www/sound/' + languageoptions.id + '/' + id[value] + '_' + languageoptions.voice + '.mp3';
                //console.log(cordova.file.applicationDirectory + 'www/sound/' + languageoptions.id + '/' + id[value] + '_' + languageoptions.voice + '.mp3');
                media = $cordovaMedia.newMedia(src);
                if(media && media != null) {
                  media.then(function() {
                    //console.log('sound played');
                  }, function () {
                    //console.log('sound error');
                  });
                } else {
                  return null;
                }
              } else {
                return null;
              }
            }
          });
          return media;
        },
        toggleAccessibility: function() {
          var status_accessibility = $localstorage.get('accessibility');
          if(status_accessibility == 'true') {
            $localstorage.set('accessibility','false');
          } else if(status_accessibility == 'false') {
            $localstorage.set('accessibility','true');
          } else {
            $localstorage.set('accessibility','true');
          }
        },
        setLanguage: function(lid) {
          var languageoptions = $localstorage.getObject('language');
          var sel_voice = 'm';
          /*if(languageoptions.voice && languageoptions.voice != null) {
            sel_voice = languageoptions.voice;
          }*/
          if(lid == 'pt') {
            sel_voice = 'f'; //temporary solution for having only 1 voice available per language
          }
          $localstorage.setObject('language', {
            id: lid,
            voice: sel_voice
          });
        },
        setVoice: function(vid) {
          var languageoptions = $localstorage.getObject('language');
          var sel_language = 'en';
          if(languageoptions.id && languageoptions.id != null) {
            sel_language = languageoptions.id;
          }
          alert("Voice switched to " + vid + "!");
          $localstorage.setObject('language', {
            id: sel_language,
            voice: vid
          });
        },
        loadOptions: function() {
          var languageoptions = $localstorage.getObject('language');
          var sel_id = 'en';
          var sel_voice = 'm';
          if(languageoptions == null){
            $localstorage.setObject('language', {
              id: sel_id,
              voice: sel_voice
            });
            return;
          }
          if(languageoptions.id && languageoptions.id != null) {
            sel_id = languageoptions.id;
          }
          if(languageoptions.voice && languageoptions.voice != null) {
            sel_voice = languageoptions.voice;
          }
          $localstorage.setObject('language', {
            id: sel_id,
            voice: sel_voice
          });
        }
      };
    });

