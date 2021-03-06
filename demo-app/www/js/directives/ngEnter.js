angular.module('demo-app')

.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        var phase = scope.$root.$$phase;
        if(phase != '$apply' && phase != '$digest')
          scope.$apply(function (){
            scope.$eval(attrs.ngEnter);
          });

        event.preventDefault();
      }
    });
  };
});
