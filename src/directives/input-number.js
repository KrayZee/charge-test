import angular from 'angular';

/**
 * @param {Number} number
 * @returns {Number}
 */
function getFractionSize(number) {
    var decimals = Math.round((number - parseInt(number)) * 100);
    if (decimals % 10) return 2;
    if (decimals % 100) return 1;
    return 0;
}

function inputNumber($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: false,
        link: function(scope, element, attr, modelController) {
            modelController.$parsers.push(function (value) {
                var number = parseInt(value);
                return isNaN(number) ? undefined : number / 100;
            });

            modelController.$formatters.push(function (value) {
                let fractionSize = getFractionSize(parseFloat(value));
                return $filter('number')(value, fractionSize);
            });
        }
    }
}

inputNumber.$inject = ['$filter'];

export default angular.module('app.directives.input-number', [])
    .directive('inputNumber', inputNumber)
    .name;