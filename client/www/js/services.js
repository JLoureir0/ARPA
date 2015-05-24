angular.module('arpa.services', [])

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
    },
    matchFromDb: function(array, result){
      var allergens = [
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
  console.log("aqui");
  var myIoSocket = io.connect('arpa.herokuapp.com');
  /*var myIoSocket = io.connect('http://192.168.56.1:3000');*/
  /*var myIoSocket = io.connect('http://localhost:3000');*/

  var Socket = socketFactory({
    ioSocket: myIoSocket
  })

  return Socket;
})

.factory('Chats', function() {
      // Might use a resource here that returns a JSON array

      // Some fake testing data
      var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
      }, {
        id: 2,
        name: 'Andrew Jostlin',
        lastText: 'Did you get the ice cream?',
        face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
      }, {
        id: 3,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
      }, {
        id: 4,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
      }];

      return {
        all: function() {
          return chats;
        },
        remove: function(chat) {
          chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
          for (var i = 0; i < chats.length; i++) {
            if (chats[i].id === parseInt(chatId)) {
              return chats[i];
            }
          }
          return null;
        }
      };
    });
