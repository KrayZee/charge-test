import './styles.scss';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import inputAddon from '../../directives/input-addon';
import inputPercent from '../../directives/input-percent';
import inputNumber from '../../directives/input-number';
import charts from '../../directives/charts';

import routing from './routes';
import controller from './controller';

export default angular.module('app.calculator', [uirouter, inputAddon, inputPercent, inputNumber, charts])
    .config(routing)
    .controller('CalculatorController', controller)
    .name;