(function() {
    "use strict";

    angular
        .module("spa.layout")
        .component("sdAreas", {
            templateUrl: areasTemplateUrl,
            controller: AreasController,
            transclude: true,
            //bindings: {},
        })
        .component("sdArea", {
            templateUrl: areaTemplateUrl,
            controller: AreaController,
            transclude: true,
            bindings: {
                label: "@",
                position: "@"
            },
            require: {
                areasController: "^^sdAreas"
            }
        })
        .directive("sdAreasSide", [function(){
            return {
                controller: AreasSideController,
                controllerAs: "sideVM",
                bindToController: true,
                restrict: "A",
                scope: false,
                require: {
                    areas: "^sdAreas"
                }
            }
        }])
    ;

    areasTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function areasTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.areas_html;
    }
    areaTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function areaTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.area_html;
    }

    AreasController.$inject = ["$scope"];
    function AreasController($scope) {
        var vm=this;
        vm.areas=[];
        vm.areasLeft = [];
        vm.areasRight = [];

        vm.$onInit = function() {
            console.log("AreasController",$scope);
        }
        return;
        //////////////
    }
    AreasController.prototype.addArea = function(area) {
        this.areas.push(area);
        if (area.position==="left") {
            this.areasLeft.push(area);
        } else if (area.position==="right") {
            this.areasRight.push(area);
        }
    }
    AreasController.prototype.getAreas = function(position) {
        var collection = null;
        if (position==="left") {
            collection=this.areasLeft;
        } else if (position==="right") {
            collection=this.areasRight;
        }
        return collection;
    }
    AreasController.prototype.countActive = function(position) {
        var collection = this.getAreas(position);
        var areasActive=0;
        angular.forEach(collection, function(area){
            if (area.show) { areasActive += 1; }
        })
        //console.log("countActive", collection, areasActive);
        return areasActive;
    }


    AreaController.$inject = ["$scope",];
    function AreaController($scope) {
        var vm=this;
        vm.show=true;
        vm.isExpanded = isExpanded;

        vm.$onInit = function() {
            console.log("AreaController",$scope);
            vm.areasController.addArea(vm);
        }
        return;
        //////////////
        function isExpanded() {
            var result = vm.show && vm.areasController.countActive(vm.position)===1;
            console.log("isExpanded", vm.position, result);
            return result;
        }
    }


    AreasSideController.$inject = ['$rootScope'];
    function AreasSideController($rootScope) {
        var vm = this;
        vm.isHidden = isHidden;
        vm.hiddenA7=false;
        vm.isHiddenA7=isHiddenA7;

        vm.$onInit = function() {
            console.log("AreasSideController", vm);

        }

        var v={
            getData:getData
        }
        $rootScope.$on('spa.subjects.TABS', function (event, data) {
            getData(data);
        });
        angular.extend(vm,v);

        return;
        /////////////////
        function isHidden(position) {
            var result=vm.areas.countActive(position)===0;
            console.log("isHidden", position, result);
            return result;
        }

        function isHiddenA7(){
            //vm.$broadcast ('hasThings');
            var result=vm.hiddenA7;
            console.log("isHiddenA7", result);
            return !result;
        }

        function getData(data){
            vm.hiddenA7=data.hasThings;
            vm.image=data.image_id;
            console.log('hasThings',vm.hiddenA7);
            console.log('image id ',vm.image);
        }
    }

})();