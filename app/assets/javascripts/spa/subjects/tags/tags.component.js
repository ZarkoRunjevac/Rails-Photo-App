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
        "spa.subjects.TagThing",
        "spa.subjects.TagsAuthz"];
    function TagEditorController($scope, $q, $state, $stateParams,
                                   Authz, Tag, TagThing,TagsAuthz) {
        var vm=this;
        vm.create = create;
        vm.clear  = clear;
        vm.update  = update;
        vm.remove  = remove;
        //vm.updateImageLinks = updateImageLinks;

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
            if(TagsAuthz.canQuery()) vm.things = TagThing.query({tag_id:itemId});
            if(TagsAuthz.canQuery()) vm.item = Tag.get({id:itemId});
            if(vm.item){
                vm.tagsAuthz.newItem(vm.item);
                $q.all([vm.item.$promise]).catch(handleError);
            }
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
        "spa.subjects.Tag",
        "spa.subjects.TagsAuthz"];
    function TagSelectorController($scope, $stateParams, Authz, Tag,TagsAuthz) {
        var vm=this;

        vm.$onInit = function() {
            console.log("TagSelectorController",$scope);
            $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                function(){
                    if (!$stateParams.id) {
                        if(TagsAuthz.canQuery()) vm.items = Tag.query();
                    }
                });
        }
        return;
        //////////////
    }

})();