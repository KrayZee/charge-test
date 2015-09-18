import './styles.scss';
import 'angular-chart.js/dist/angular-chart.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import angularChart from 'angular-chart.js/dist/angular-chart';
import inputAddon from '../../directives/input-addon';

import routing from './routes';
import controller from './controller';

export default angular.module('app.calculator', [uirouter, inputAddon, 'chart.js'])
    .config(routing)
    .controller('CalculatorController', controller)
    .name;