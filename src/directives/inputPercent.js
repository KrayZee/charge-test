import angular from 'angular';

function inputPercent() {
    return {
        priority: 1,
        require: 'ngModel',
        restrict: 'A',
        scope: false,
        link: function(scope, element, attr, modelController) {
            modelController.$parsers.push(function (value) {
                var number = parseInt(value);
                return isNaN(number) ? undefined : number / 100;
            });

            modelController.$formatters.push(function (value) {
                var number = parseFloat(value);
                return isNaN(number) ? undefined : number * 100;
            });
        }
    }
}

export default angular.module('app.directives.input-percent', [])
    .directive('inputPercent', inputPercent)
    .name;