(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .component("sdTagEditor", {
            templateUrl: tagEditorTemplateUrl,
            controller: TagEditorController,
            bindings: {
                authz: "<"
            },
            require: {
                tagsAuthz: "^sdTagsAuthz"
            }
        })
        .component("sdTagSelector", {
            templateUrl: tagSelectorTemplateUrl,
            controller: TagSelectorController,
            bindings: {
                authz: "<"
            }
        })
    ;


    tagEditorTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function tagEditorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.tag_editor_html;
    }
    tagSelectorTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function tagSelectorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.tag_selector_html;
    }

    TagEditorController.$inject = ["$scope","$q",
        "$state","$stateParams",
        "spa.authz.Authz",
        "spa.subjects.Tag",
        "spa.subjects.TagThing"];
    function TagEditorController($scope, $q, $state, $stateParams,
                                   Authz, Tag, TagThing) {
        var vm=this;
        vm.create = create;
        vm.clear  = clear;
        vm.update  = update;
        vm.remove  = remove;
        vm.haveDirtyLinks = haveDirtyLinks;
        vm.updateImageLinks = updateImageLinks;

        vm.$onInit = function() {
            console.log("TagEditorController",$scope);
            $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                function(){
                    if ($stateParams.id) {
                        reload($stateParams.id);
                    } else {
                        newResource();
                    }
                });
        }

        return;
        //////////////
        function newResource() {
            vm.item = new Tag();
            vm.tagsAuthz.newItem(vm.item);
            return vm.item;
        }

        function reload(tagId) {
            var itemId = tagId ? tagId : vm.item.id;
            console.log("re/loading tag", itemId);
            vm.images = TagThing.query({tag_id:itemId});
            vm.item = Tag.get({id:itemId});
            vm.tagsAuthz.newItem(vm.item);
            vm.images.$promise.then(
                function(){
                    angular.forEach(vm.images, function(ti){
                        ti.originalPriority = ti.priority;
                    });
                });
            $q.all([vm.item.$promise,vm.images.$promise]).catch(handleError);
        }
        function haveDirtyLinks() {
            for (var i=0; vm.images && i<vm.images.length; i++) {
                var ti=vm.images[i];
                if (ti.toRemove || ti.originalPriority != ti.priority) {
                    return true;
                }
            }
            return false;
        }

        function create() {
            vm.item.errors = null;
            vm.item.$save().then(
                function(){
                    console.log("tag created", vm.item);
                    $state.go(".",{id:vm.item.id});
                },
                handleError);
        }

        function clear() {
            newResource();
            $state.go(".",{id: null});
        }

        function update() {
            vm.item.errors = null;
            var update=vm.item.$update();
            updateImageLinks(update);
        }
        function updateImageLinks(promise) {
            console.log("updating links to images");
            var promises = [];
            if (promise) { promises.push(promise); }
            angular.forEach(vm.images, function(ti){
                if (ti.toRemove) {
                    promises.push(ti.$remove());
                } else if (ti.originalPriority != ti.priority) {
                    promises.push(ti.$update());
                }
            });

            console.log("waiting for promises", promises);
            $q.all(promises).then(
                function(response){
                    console.log("promise.all response", response);
                    //update button will be disabled when not $dirty
                    $scope.tagform.$setPristine();
                    reload();
                },
                handleError);
        }

        function remove() {
            vm.item.$remove().then(
                function(){
                    console.log("tag.removed", vm.item);
                    clear();
                },
                handleError);
        }

        function handleError(response) {
            console.log("error", response);
            if (response.data) {
                vm.item["errors"]=response.data.errors;
            }
            if (!vm.item.errors) {
                vm.item["errors"]={}
                vm.item["errors"]["full_messages"]=[response];
            }
            $scope.tagform.$setPristine();
        }
    }

    TagSelectorController.$inject = ["$scope",
        "$stateParams",
        "spa.authz.Authz",
        "spa.subjects.Tag"];
    function TagSelectorController($scope, $stateParams, Authz, Tag) {
        var vm=this;

        vm.$onInit = function() {
            console.log("TagSelectorController",$scope);
            console.log("Authz.getAuthorizedUserId()",Authz.getAuthorizedUserId());
            $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                function(){
                    if (!$stateParams.id) {
                        vm.items = Tag.query();
                    }
                });
        }
        return;
        //////////////
    }

})();