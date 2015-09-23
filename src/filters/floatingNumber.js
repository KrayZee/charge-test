import angular from 'angular';

/**
 * @param {number} maxSize
 * @param {number} number
 * @returns {number}
 */
function getFractionSize(maxSize, number) {
    var divider = 10;
    var exponent = Math.pow(divider, maxSize);
    var decimals = Math.round((number - parseInt(number)) * exponent);

    for (let i = 0; i < maxSize; i++) {
        if (decimals % divider) return maxSize - i;
        divider *= 10;
    }

    return 0;
}

function floatingNumber($filter) {
    return function(value, maxFractionSize) {
        let number = parseFloat(value);
        if (isNaN(number)) return '';

        let fractionSize = getFractionSize(maxFractionSize, number);
        return $filter('number')(value, fractionSize);
    }
}

floatingNumber.$inject = ['$filter'];

export default angular.module('app.filters.floating-number', [])
    .filter('floatingNumber', floatingNumber)
    .name;