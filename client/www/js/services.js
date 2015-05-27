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
        getAllergens: function(){
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
        matchFromDb: function(array, result){
          var allergens = this.getAllergens();

          for(var i = 0; i < array.length; i++){
            for(var j = 0; j < allergens.length; j++){
              if(array[i] === allergens[j].name){
                result.push({id: allergens[j].id, name: allergens[j].name, src: allergens[j].src});
              }
            }
          }
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

    .factory('$accessibility', function($ionicPlatform, $cordovaMedia, $localstorage) {

      var id = ['off','on','allergies','applications','definitions'];

      return {
        getVoice: function(value) {
          var media;
          $ionicPlatform.ready(function(){
            if(typeof cordova != "undefined"){
              var src;
              var languageoptions = $localstorage.getObject('language');
              if(languageoptions && languageoptions != null) {
                src = cordova.file.applicationDirectory + 'www/sound/' + languageoptions.id + '/' + id[value] + '_' + languageoptions.voice + '.mp3';
                console.log(cordova.file.applicationDirectory + 'www/sound/' + languageoptions.id + '/' + id[value] + '_' + languageoptions.voice + '.mp3');
                media = $cordovaMedia.newMedia(src);
                if(media && media != null) {
                  media.then(function() {
                    console.log('AQUI sucess');
                  }, function () {
                    console.log('AQUI no sucess');
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
              console.log('Desligar acessibilidade.');
              $localstorage.set('accessibility','false');
              var sound = this.getVoice(0);
              sound.play();
          } else if(status_accessibility == 'false') {
              console.log('Ligar acessibilidade');
              $localstorage.set('accessibility','true');
              var sound = this.getVoice(1);
              sound.play();
          } else {
              $localstorage.set('accessibility','true');
              var sound = this.getVoice(1);
              sound.play();
          }
        },
        setLanguage: function(lid) {
          var sel_voice = 'f';
          var translator = angular.module('myApp', ['pascalprecht.translate']);
          var languageoptions = $localstorage.getObject('language');
          if(languageoptions.voice && languageoptions.voice != null) {
            sel_voice = languageoptions.voice;
          }
            alert("Language switched to " + lid + "!");
          $localstorage.setObject('language', {
              id: lid,
              voice: sel_voice
          });
        },
        loadOptions: function() {
          var languageoptions = $localstorage.getObject('language');
          if(languageoptions == null){
            $localstorage.setObject('language', {
              id: 'pt',
              voice: 'f'
            });
            return;
          }
          var sel_id = 'pt';
          var sel_voice = 'f';
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
