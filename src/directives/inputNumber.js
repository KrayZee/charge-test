import angular from 'angular';

import floatingNumber from '../filters/floatingNumber';

function inputNumber($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: false,
        link: function(scope, element, attr, modelController) {
            modelController.$parsers.push(function (value) {
                var number = parseInt(value);
                return isNaN(number) ? undefined : number;
            });

            modelController.$formatters.push(function (value) {
                return $filter('floatingNumber')(value, 2);
            });
        }
    }
}

inputNumber.$inject = ['$filter'];

export default angular.module('app.directives.input-number', [floatingNumber])
    .directive('inputNumber', inputNumber)
    .name;