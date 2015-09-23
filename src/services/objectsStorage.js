import angular from 'angular';

class ObjectsStorage {
    constructor($http) {
        this.$load = function (type, url) {
            $http.get(url).then(response => {
                this[type] = response.data;
            })
        }
    }
}

ObjectsStorage.$inject = ['$http'];

export default angular.module('app.services.objects-storage', [])
    .service('objectsStorage', ObjectsStorage)
    .name;