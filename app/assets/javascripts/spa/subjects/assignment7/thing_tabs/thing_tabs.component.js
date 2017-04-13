(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .component("sdThingTabs", {
            templateUrl: tabsTemplateUrl,
            controller: ThingTabsController,
            controllerAs: "tabsVM",
            bindToController: true,

            bindings:{
                image:"="
            }
        })
        .component("sdThingTab", {
            templateUrl: tabTemplateUrl,
            controller: ThingTabController,

            bindings: {
                label: "@",
                thing:"="
            },
            require: {
                tabsController: "^^sdThingTabs"
            }
        })
    ;

    tabsTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function tabsTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.thing_tabs_html;
    }
    tabTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function tabTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.thing_tab_html;
    }

    ThingTabsController.$inject = ["$scope",
        "spa.subjects.ImageThing","$q"];
    function ThingTabsController($scope,ImageThing,$q) {
        var vm=this;
        vm.tabs=[];
        vm.selectTab = selectTab;

        vm.$onInit = function() {
            console.log("ThingTabsController",$scope);
            //vm.things = ImageThing.query({image_id:itemId});


        }

        vm.$postLink = function() {
            $scope.$watch(
                function() { return vm.image },
                function(image) {
                    if(image){
                        vm.things = ImageThing.query({image_id:vm.image});
                        $q.all([vm.things.$promise]).then(
                            function(response){
                                vm.things=response[0];
                                vm.thing=vm.things[0];
                                console.log('thing_name',vm.thing.thing_name);
                            },
                            handleError);

                        console.log('spa.subjects.image.id',vm.image);
                    }
                }
            );

        }

        return;
        //////////////
        function selectTab(tab) {
            angular.forEach(vm.tabs, function(tab){
                tab.selected=false;
            });
            tab.selected=true;
        }
        function handleError(response) {
            console.log("error", response);
        }
    }

    ThingTabsController.prototype.addTab = function(tab) {
        if (this.tabs.length===0) {
            tab.selected = true;
        }
        this.tabs.push(tab);
    }


    ThingTabController.$inject = ["$scope",
        "spa.subjects.ImageThing"];
    function ThingTabController($scope,ImageThing) {
        var vm=this;

        vm.$onInit = function() {
            console.log("ThingTabController",$scope);
            vm.tabsController.addTab(vm);
        }
        return;
        //////////////
    }
})();