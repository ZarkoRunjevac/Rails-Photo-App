(function() {
    "use strict";

    angular
        .module("spa", [
            "ui.router",
            "ngFileUpload",
            "uiCropper",
            "spa.cities",
            "spa.config",
            "spa.authn",
            "spa.authz",
            "spa.layout",            
            "spa.subjects"
        ]);
})();