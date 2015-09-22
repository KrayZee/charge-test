import angular from 'angular';

import routing from './app.config';

// features
import calculator from './features/calculator';

angular.module('app', [calculator])
    .config(routing);