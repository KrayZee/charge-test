routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('calculator', {
            url: '/',
            template: require('./template.html'),
            controller: 'CalculatorController',
            controllerAs: 'calculator'
        });
}