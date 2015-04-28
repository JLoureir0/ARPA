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

    .controller('DashCtrl', function($scope) {})
	
	.controller('MainCtrl', function($scope, $localstorage, $http){
		if($localstorage.getObject('userinfo') != null) {
			var userinfo = $localstorage.getObject('userinfo');
			$scope.username = userinfo.name;
			//$scope.userbirthday = userinfo.birthday;
			//$http.get(userinfo.picture).then(function(resp) {
				$scope.userpicture = 'http://graph.facebook.com/' + userinfo.id + '/picture?width=270&height=270';
				//$scope.userpicture = userinfo.picture;
			/*}, function(err) {
				$scope.userpicture = './img/Logo_arpa.png';
			});*/
		} else {
			$scope.username = 'ARPA';
			$scope.userpicture = './img/logo_arpa.svg';
		}
	})

    .controller('AllergensCtrl', function($scope){
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
            }else{
                $scope.extra_icons_allergs = "./img/allergens-icons/mais.svg";
                $scope.value_allergies = true;
            }
        };

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
                name: "tremoços",
                src: "./img/allergens-icons/tremoços.svg"
            }
        ];

        $scope.intolerances = [
            {
                id: 1,
                name: "lacteos",
                src: "./img/allergens-icons/lacteos.svg"
            },

        ];
    })



    .controller('ChatsCtrl', function($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
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

    .controller('DefinitionsCtrl', function($scope, $state, $localstorage, $window) {
      $scope.fbLogin = function(){
        openFB.login(
          function(response){
            if(response.status == 'connected'){
              console.log('Login succedeed');
			  	openFB.api({
					path: '/me',
					params: {fields: 'name,birthday,picture'},
					success: function(user) {
						$scope.$apply(function() {
							$scope.user = user;
							var date = new Date($scope.user.birthday);							
							$localstorage.setObject('userinfo', {
								logged: true,
								id: $scope.user.id,
								name: $scope.user.name,
								birthday: date.toLocaleDateString(),
								picture: $scope.user.picture.data.url
							});		
							$window.location.reload();					
						});
					},
					error: function(error) {
						alert('Unable to connect to your data');
					}
				});
            }else{
              alert('Facebook login failed!');
            }
          }, {scope: 'email, publish_actions, user_birthday'});
      }
	  $scope.logout = function(){
        $localstorage.setObject('userinfo',null);
		$window.location.reload();
      }	  
    });
