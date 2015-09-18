import angular from 'angular';

var POSITION_BEFORE = 0;
var POSITION_AFTER = 1;

/**
 * @param {string} attrName
 * @param {int} addonPosition
 * @returns {{require: string, restrict: string, scope: boolean, link: link}}
 */
function inputAddon(attrName, addonPosition) {
    function removeAddon(value) {
        if (!value) return value;

        switch (addonPosition) {
            case POSITION_BEFORE:
                return value.indexOf(addonText) == 0
                    ? value.replace(addonText, '') : value;

            case POSITION_AFTER:
                return value.lastIndexOf(addonText) == value.length - addonText.length
                    ? value.substring(0, value.length - addonText.length) : value;

            default: return value;
        }
    }

    return {
        require: 'ngModel',
        restrict: 'A',
        scope: false,
        link: function(scope, element, attr, modelController) {
            var addonText = attr[attrName];

            modelController.$parsers.push(function (value) {
                return removeAddon(value);
            });

            modelController.$formatters.push(function (value) {
                switch (addonPosition) {
                    case POSITION_BEFORE: return `${addonText} ${value}`;
                    case POSITION_AFTER:  return `${value} ${addonText}`;
                    default: return value;
                }
            });
        }
    }
}

export default angular.module('app.directives.input-addon', [])
    .directive('inputPrefix', function() { return inputAddon('inputPrefix', POSITION_BEFORE); })
    .directive('inputSuffix', function() { return inputAddon('inputSuffix', POSITION_AFTER); })
    .name;