import './styles.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './routes';
import controller from './controller';

export default angular.module('app.calculator', [uirouter])
    .config(routing)
    .controller('CalculatorController', controller)
    .name;