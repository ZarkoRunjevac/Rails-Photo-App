(function() {
  "use strict";

  angular
    .module("spa.subjects")
    .factory("spa.subjects.ThingTag", ThingTag);

  ThingTag.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function ThingTag($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/thingtags",
      { thing_id: '@thing_id', 
        id: '@id'},
      { update: {method:"PUT"} 
      });
  }

})();