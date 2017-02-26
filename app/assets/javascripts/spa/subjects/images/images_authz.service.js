(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .factory("spa.subjects.ImagesAuthz", ImagesAuthzFactory);

    ImagesAuthzFactory.$inject = ["spa.authz.Authz",
        "spa.authz.BasePolicy"];
    function ImagesAuthzFactory(Authz, BasePolicy) {
        function ImagesAuthz() {
            BasePolicy.call(this, "Image");
        }

        //start with base class prototype definitions
        ImagesAuthz.prototype = Object.create(BasePolicy.prototype);
        ImagesAuthz.constructor = ImagesAuthz;

        //override and add additional methods
        ImagesAuthz.prototype.canCreate=function() {
            //console.log("ItemsAuthz.canCreate");
            return Authz.isAuthenticated();
        };

        return new ImagesAuthz();
    }
})();