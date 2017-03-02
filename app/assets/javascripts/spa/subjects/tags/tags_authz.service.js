(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .factory("spa.subjects.TagsAuthz", TagsAuthzFactory);

    TagsAuthzFactory.$inject = ["spa.authz.Authz",
        "spa.authz.BasePolicy"];
    function TagsAuthzFactory(Authz, BasePolicy) {
        function TagsAuthz() {
            BasePolicy.call(this, "Tag");
        }
        //start with base class prototype definitions
        TagsAuthz.prototype = Object.create(BasePolicy.prototype);
        TagsAuthz.constructor = TagsAuthz;


        //override and add additional methods
        TagsAuthz.prototype.canQuery=function() {
            //console.log("TagsAuthz.canQuery");
            return Authz.isAuthenticated();
            //return true;
        };

        //add custom definitions
        TagsAuthz.prototype.canAddImage=function(tag) {
            return Authz.isMember(tag);
        };
        TagsAuthz.prototype.canUpdateImage=function(tag) {
            return Authz.isOrganizer(tag)
        };
        TagsAuthz.prototype.canRemoveImage=function(tag) {
            return Authz.isOrganizer(tag) || Authz.isAdmin();
        };

        TagsAuthz.prototype.canCreate=function() {
            //console.log("ItemsAuthz.canCreate");
            return Authz.isAuthenticated();
        };

        return new TagsAuthz();
    }
})();