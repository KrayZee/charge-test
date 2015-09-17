import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './app.config';

// features
import calculator from './features/calculator';

angular.module('app', [uirouter, calculator])
    .config(routing);