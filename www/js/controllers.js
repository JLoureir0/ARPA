angular.module('arpa.controllers', [])

    .controller('DashCtrl', function($scope) {})

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
    });
