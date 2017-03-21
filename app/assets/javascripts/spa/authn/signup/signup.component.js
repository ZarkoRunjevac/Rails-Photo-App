(function() {
    "use strict";

    angular
        .module("spa.authn")
        .component("sdSignup", {
            templateUrl: templateUrl,
            controller: SignupController,
        });


    templateUrl.$inject = ["spa.config.APP_CONFIG"];
    function templateUrl(APP_CONFIG) {
        return APP_CONFIG.authn_signup_html;
    }

    SignupController.$inject = ["$scope","$state","spa.authn.Authn","spa.layout.DataUtils"];
    function SignupController($scope, $state, Authn, DataUtils) {
        var vm=this;
        vm.signupForm = {}

        vm.signup = signup;
        vm.setImageContent = setImageContent;

        vm.$onInit = function() {
            console.log("SignupController",$scope);
        }
        return;
        //////////////
        function signup() {
            console.log("signup...");
            $scope.signup_form.$setPristine();
            Authn.signup(vm.signupForm).then(
                function(response){
                    vm.id = response.data.data.id;
                    console.log("signup complete", response.data, vm);
                    //$state.go("home");
                    Authn.activate().then(
                        function(response){
                            $state.go("home");
                        }
                    );
                    
                },
                function(response){
                    vm.signupForm["errors"]=response.data.errors;
                    console.log("signup failure", response, vm);
                }
            );
        }

        function setImageContent(dataUri) {
            console.log("setImageContent", dataUri ? dataUri.length : null);
            vm.signupForm.image_content = DataUtils.getContentFromDataUri(dataUri);
        }

    }
})();