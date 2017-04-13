(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .component("sdA7Images", {
            templateUrl: imagesTemplateUrl,
            controller: A7ImagesController,
        })
        .component("sdA7ImageViewer", {
            templateUrl: imageViewerTemplateUrl,
            controller: A7ImageViewerController,
            bindings: {
                name: "@",
                minWidth: "@"
            }
        })
    ;

    imagesTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function imagesTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.a7_images_html;
    }
    imageViewerTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
    function imageViewerTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.a7_image_viewer_html;
    }

    A7ImagesController.$inject = ["$scope",
        "spa.subjects.currentSubjects",'$rootScope'];
    function A7ImagesController($scope, currentSubjects,$rootScope) {
        var vm=this;
        vm.imageClicked = imageClicked;
        vm.isA7Image = currentSubjects.isCurrentImageIndex;
        //$rootScope.$emit('hThings',currentSubjects.getCurrentImage()!=null);
        vm.$onInit = function() {
            console.log("A7ImagesController",$scope);
            vm.isA7Image(-1);

        }
        vm.$postLink = function() {
            $scope.$watch(
                function() { return currentSubjects.getImages(); },
                function(images) {
                    vm.images = images;
                    vm.isA7Image(-1);
                    currentSubjects.setCurrentImage(-1);
                }
            );
           /* vm.$on('hasThings',function (e) {
                vm.$emit('hThings',currentSubjects.getCurrentImage()!=null);
            });*/
        }
        return;
        //////////////
        function imageClicked(index) {
            currentSubjects.setCurrentImage(index);
            var image=currentSubjects.getCurrentImage();
           /* $rootScope.$emit('spa.subjects.image.id',image.image_id);
            $rootScope.$emit('hasThings',currentSubjects.getCurrentImage().thing_id!=null);*/

            $rootScope.$emit('spa.subjects.TABS',{
                hasThings:currentSubjects.getCurrentImage().thing_id!=null,
                image_id:image.image_id
            });

        }
    }

    A7ImageViewerController.$inject = ["$scope",
        "spa.subjects.currentSubjects"];
    function A7ImageViewerController($scope, currentSubjects) {
        var vm=this;
        vm.viewerIndexChanged = viewerIndexChanged;

        vm.$onInit = function() {
            console.log("A7ImageViewerController",$scope);
        }
        vm.$postLink = function() {
            $scope.$watch(
                function() { return currentSubjects.getImages(); },
                function(images) { vm.images = images; }
            );
            $scope.$watch(
                function() { return currentSubjects.currentSubjects },
                function(index) { vm.a7ImageIndex = index; }
            );
        }
        return;
        //////////////
        function viewerIndexChanged(index) {
            console.log("viewer index changed, setting a7Image", index);
            currentSubjects.setCurrentImage(index);
        }
    }

})();