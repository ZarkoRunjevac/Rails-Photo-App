(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .factory("spa.subjects.Tag", TagFactory);

    TagFactory.$inject = ["$resource", "spa.config.APP_CONFIG"];
    function TagFactory($resource, APP_CONFIG) {
        var service = $resource(APP_CONFIG.server_url + "/api/type_of_things/:id",
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
        if (!data['name']) {
            data['name']=null;
        }
        return angular.toJson(data);
    }
})();