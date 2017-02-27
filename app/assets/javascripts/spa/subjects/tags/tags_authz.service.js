(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .factory("spa.subjects.TagsAuthz", TagsAuthzFactory);

    TagsAuthzFactory.$inject = ["spa.authz.Authz",
        "spa.authz.BasePolicy"];
    function TagsAuthzFactory(Authz, BasePolicy) {
        function TagsAuthz() {
            BasePolicy.call(this, "Thing");
        }
        //start with base class prototype definitions
        TagsAuthz.prototype = Object.create(BasePolicy.prototype);
        TagsAuthz.constructor = TagsAuthz;


        //override and add additional methods
        TagsAuthz.prototype.canQuery=function() {
            //console.log("TagsAuthz.canQuery");
            return Authz.isAuthenticated();
        };

        //add custom definitions
        TagsAuthz.prototype.canAddImage=function(thing) {
            return Authz.isMember(thing);
        };
        TagsAuthz.prototype.canUpdateImage=function(thing) {
            return Authz.isOrganizer(thing)
        };
        TagsAuthz.prototype.canRemoveImage=function(thing) {
            return Authz.isOrganizer(thing) || Authz.isAdmin();
        };

        return new TagsAuthz();
    }
})();