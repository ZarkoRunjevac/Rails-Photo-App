(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .factory("spa.subjects.TagThing", TagThing);

    TagThing.$inject = ["$resource", "spa.config.APP_CONFIG"];
    function TagThing($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/tags/:tag_id/thing_tags/:id",
            { tag_id: '@tag_id',
                id: '@id'},
            { update: {method:"PUT"}
            });
    }

})();