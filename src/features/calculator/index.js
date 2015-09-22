import './styles.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import inputAddon from '../../directives/inputAddon';
import inputPercent from '../../directives/inputPercent';
import inputNumber from '../../directives/inputNumber';
import charts from '../../directives/charts';

import floatingNumber from '../../filters/floatingNumber';

import routing from './routes';
import controller from './controller';

export default angular.module('app.calculator', [
    uirouter,
    inputAddon,
    inputPercent,
    inputNumber,
    floatingNumber,
    charts
])
    .config(routing)
    .controller('CalculatorController', controller)
    .name;