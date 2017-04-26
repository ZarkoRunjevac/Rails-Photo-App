(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .component("sdThingsForType", {
            templateUrl: thingsForTypeTemplateUrl,
            controller: ThingsForTypeController,
        })
        
    ;

    thingsForTypeTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function thingsForTypeTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.things_for_type_html;
    }
   

    ThingsForTypeController.$inject = ["$scope",
        "spa.subjects.currentTypes"];
    function ThingsForTypeController($scope,currentTypes) {
        var vm=this;
        vm.thingClicked = thingClicked;
        vm.isCurrentThing = currentTypes.isCurrentThingIndex;

        vm.$onInit = function() {
            console.log("ThingsForTypeController",$scope);
        }
        vm.$postLink = function() {
            $scope.$watch(
                function() { return currentTypes.getThings(); },
                function(things) { vm.things = things; }
            );
        }
        return;
        //////////////
        function thingClicked(index) {
            currentTypes.setCurrentThing(index);
        }
    }

    
})();