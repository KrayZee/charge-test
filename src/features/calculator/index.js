import './styles.scss';

import angular from 'angular';

import inputAddon from '../../directives/inputAddon';
import inputPercent from '../../directives/inputPercent';
import inputNumber from '../../directives/inputNumber';
import charts from '../../directives/charts';

import floatingNumber from '../../filters/floatingNumber';

import objectsStorage from '../../services/objectsStorage';

import controller from './controller';

export default angular.module('app.calculator', [
    inputAddon,
    inputPercent,
    inputNumber,
    charts,
    floatingNumber,
    objectsStorage
])
    .controller('CalculatorController', controller)
    .name;