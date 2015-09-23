require('script!angular-i18n/angular-locale_uk.js');

routing.$inject = ['$locationProvider'];

export default function routing($locationProvider) {
    $locationProvider.html5Mode(true);
}