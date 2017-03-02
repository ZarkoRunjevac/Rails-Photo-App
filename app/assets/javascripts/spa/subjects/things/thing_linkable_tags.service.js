(function() {
  "use strict";

  angular
    .module("spa.subjects")
    .factory("spa.subjects.ThingLinkableTag", ThingLinkableTag);

  ThingLinkableTag.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function ThingLinkableTag($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/linkable_tags");
  }

})();