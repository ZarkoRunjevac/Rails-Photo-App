(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .component("sdTypes", {
            templateUrl: typesTemplateUrl,
            controller: TypesController,
        })

    ;

    typesTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function typesTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.types_html;
    }

    TypesController.$inject = ["$scope",
        "spa.subjects.currentTypes"];
    function TypesController($scope,currentTypes) {
        var vm=this;
        vm.tagClicked = tagClicked;
        vm.search=search;
        vm.isCurrentTag = currentTypes.isCurrentTagIndex;

        vm.$onInit = function() {
            console.log("CurrentTypesController",$scope);
        }
        vm.$postLink = function() {
            /*$scope.$watch(
                function() { return currentTypes.getTags(); },
                function(tags) { vm.tags = tags; }
            );*/
            $scope.$watch(
                function(){return vm.type_query;},
                function(newVal, oldVal){

                    vm.tags=currentTypes.getTagsByQuery(newVal);
                if(vm.tags.length>0){
                    currentTypes.setCurrentTag(vm.tags[0].id);
                }
            });
        }
        return;
        //////////////
        function tagClicked(index) {
            currentTypes.setCurrentTag(index);
        }

        function search(){
            vm.tags=currentTypes.getTagsByQuery(vm.type_query);
        }
    }


})();