/**
 * Created by zarko.runjevac on 1/26/2017.
 */
(function() {
    "use strict";

    angular
        .module("spa.cities")
        .directive("cityForm", CitiesFormDirective);

    CitiesFormDirective.$inject = ["spa.APP_CONFIG"];

    function CitiesFormDirective(APP_CONFIG) {
        var directive = {
            templateUrl: APP_CONFIG.cities_form_html,
            replace: true,
            bindToController: true,
            controller: "spa.cities.CitiesFormController",
            controllerAs: "citiesFormVM",
            restrict: "E",
            scope: {
                city:'=',
                create: "&",
                update:"&",
                remove:"&"
            },
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            console.log("CitiesFormDirective", scope);

        }
    }

})();