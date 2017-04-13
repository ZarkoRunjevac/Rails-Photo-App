(function() {
    'use strict';

    angular
        .module('spa.subjects')
        .service('spa.subjects.Thing', ThingFactory);

    ThingFactory.$inject = ["$resource", "spa.config.APP_CONFIG"];

    /* @ngInject */
    function ThingFactory($resource,APP_CONFIG) {
        var service = $resource(APP_CONFIG.server_url + "/api/things/:id",
            { id: '@id' },
            {
                update: {method: "PUT"},
                save:   {method: "POST", transformRequest: checkEmptyPayload }
            });
        return service;

    }

    //rails wants at least one parameter of the document filled in
    //all of our fields are optional
    //ngResource is not passing a null field by default, we have to force it
    function checkEmptyPayload(data) {
        if (!data['description']) {
            data['description']=null;
        }

        if (!data['notes']) {
            data['notes']=null;
        }
        return angular.toJson(data);
    }
})();