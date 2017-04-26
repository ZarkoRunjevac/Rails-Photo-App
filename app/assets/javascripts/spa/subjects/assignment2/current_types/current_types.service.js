(function() {
    "use strict";

    angular
        .module("spa.subjects")
        .service("spa.subjects.currentTypes", CurrentTypes);

    CurrentTypes.$inject = ["$rootScope","$q",
        "$resource",
        "spa.geoloc.currentOrigin",
        "spa.config.APP_CONFIG"];

    function CurrentTypes($rootScope, $q, $resource, currentOrigin, APP_CONFIG) {
        var subjectsResource = $resource(APP_CONFIG.server_url + "/api/subjects",{},{
            query: { cache:false, isArray:true }
        });

        var subjectsTagsResource = $resource(APP_CONFIG.server_url + "/api/types",{},{
            query: { cache:false, isArray:true }
        });

        var service = this;
        service.version = 0;
        service.images = [];
        service.imageIdx = null;
        service.thingIdx=0;
        service.thingIdx=[];
        service.tags=[];
        service.tagIdx = null;
        service.refresh = refresh;
        service.isCurrentImageIndex = isCurrentImageIndex;
        service.isCurrentThingIndex = isCurrentThingIndex;
        service.isCurrentTagIndex = isCurrentTagIndex;


        //refresh();
        $rootScope.$watch(function(){ return currentOrigin.getVersion(); }, refresh);
        return;
        ////////////////
        function refresh() {
            var params=currentOrigin.getPosition();
            if (!params || !params.lng || !params.lat) {
                params=angular.copy(APP_CONFIG.default_position);
            } else {
                params["distance"]=true;
            }

            if (currentOrigin.getDistance() > 0) {
                params["miles"]=currentOrigin.getDistance();
            }
            params["order"]="ASC";
            console.log("refresh",params);

            var p1=refreshImages(params);
            params["subject"]="thing";

            var p2=refreshTags();
            $q.all([p1,p2]);
        }

        function refreshImages(params) {
            var result=subjectsResource.query(params);
            result.$promise.then(
                function(images){
                    service.images=images;
                    service.version += 1;
                    if (!service.imageIdx || service.imageIdx > images.length) {
                        service.imageIdx=0;
                    }
                    console.log("refreshImages", service);
                });
            return result.$promise;
        }


        function refreshTags() {
            var result=subjectsTagsResource.query();
            result.$promise.then(
                function(tags){
                    service.tags=tags;
                    service.version += 1;
                    if (!service.tagIdx || service.tagIdx > tags.length) {
                        service.tagIdx=null;
                        service.thingIdx=null;
                    }
                    console.log("refreshTags", service);
                });
            return result.$promise;
        }

        function isCurrentImageIndex(index) {
            //console.log("isCurrentImageIndex", index, service.imageIdx === index);
            return service.imageIdx === index;
        }
        function isCurrentThingIndex(index) {
            //console.log("isCurrentThingIndex", index, service.thingIdx === index);
            return service.thingIdx === index;
        }

        function isCurrentTagIndex(index) {
            console.log("isCurrentTagIndex", index, service.tagIdx, service.tagIdx === index);
            return service.tagIdx === index;
        }

    }

    CurrentTypes.prototype.getVersion = function() {
        return this.version;
    }
    CurrentTypes.prototype.getImages = function() {

        return this.images;

    }
    CurrentTypes.prototype.getThings = function() {

        if(this.getCurrentTag()) return this.getCurrentTag().things;
        else return null;
    }
    CurrentTypes.prototype.getTags = function() {
        return this.tags;

    }
    CurrentTypes.prototype.getTagsByQuery = function(type_query) {
        //return this.tags;
         var tags=[];
         if(type_query==null)
         {
             this.setCurrentTag(null,null);
             return this.tags;
         }
        for(var i=0; i<this.tags.length; i++) {
            var tag=this.tags[i];

            if(tag.name.toLowerCase().search(type_query.toLowerCase())>-1){
                tags.push(this.tags[i]);
            }
        }

        return tags;

    }
    CurrentTypes.prototype.getCurrentImageIndex = function() {
        return this.imageIdx;
    }
    CurrentTypes.prototype.getCurrentImage = function() {
        return this.images.length > 0 ? this.images[this.imageIdx] : null;
    }
    CurrentTypes.prototype.getCurrentThing = function() {
        if(this.getCurrentTag())    return this.getCurrentTag().things.length > 0 ? this.getCurrentTag().things[this.thingIdx] : null;
        else return null;
    }

    CurrentTypes.prototype.getCurrentTag = function() {
        if(this.tags)   {
            for(var i=0; i<this.tags.length; i++) {
                var tag = this.tags[i];
                if(tag.id===this.tagIdx) {
                    return tag;
                    break;
                }
            }
        }
        else return null;
    }

    CurrentTypes.prototype.getCurrentImageId = function() {
        var currentImage = this.getCurrentImage();
        return currentImage ? currentImage.image_id : null;
    }
    CurrentTypes.prototype.getCurrentThingId = function() {
        var currentThing = this.getCurrentThing();
        return currentThing ? currentThing.thing_id : null;
    }

    CurrentTypes.prototype.getCurrentTagId = function() {
        var currentTag = this.getCurrentTag();
        return currentTag ? currentTag.id : null;
    }


    CurrentTypes.prototype.setCurrentImage = function(index, skipThing) {
        if (index >= 0 && this.images.length > 0) {
            this.imageIdx = (index < this.images.length) ? index : 0;
        } else if (index < 0 && this.images.length > 0) {
            this.imageIdx = this.images.length - 1;
        } else {
            this.imageIdx = null;
        }



        console.log("setCurrentImage", this.imageIdx, this.getCurrentImage());
        return this.getCurrentImage();
    }

    CurrentTypes.prototype.setCurrentThing = function(index, skipImage) {
        if(this.getCurrentTag()){
            if (index >= 0 && this.getCurrentTag().things.length > 0) {
                this.thingIdx = (index < this.getCurrentTag().things.length) ? index : 0;
            } else if (index < 0 && this.getCurrentTag().things.length > 0) {
                this.thingIdx = this.getCurrentTag().things.length - 1;
            } else {
                this.thingIdx=null;
            }


            return this.getCurrentThing();
        }
        return null;

    }

    CurrentTypes.prototype.setCurrentTag = function(index, skipTag){
        //find tag
        if(index==null) this.tagIdx=null;
        for(var i=0; i<this.tags.length; i++) {
            var tag=this.tags[i];
            if(tag.id===index) {
                this.tagIdx =index;
                this.setCurrentThing(0,null);
                break;
            }else {
                this.tagIdx=null;
            }
        }
        /*if (index >= 0 && this.tags.length > 0) {
            this.tagIdx = (index < this.tags.length) ? index : 0;
            this.setCurrentThing(0,null);
        } else if (index < 0 && this.tags.length > 0) {
            this.tagIdx = this.tags.length - 1;
            this.setCurrentThing(0,null);
        } else {
            this.tagIdx=null;
        }*/


        console.log("setCurrentTag", this.tagIdx, this.getCurrentTag());
        return this.getCurrentTag();
    }




    CurrentTypes.prototype.setCurrentImageId = function(image_id, skipThing) {
        var found=this.getCurrentImageId() === image_id;
        if (image_id && !found) {
            for(var i=0; i<this.images.length; i++) {
                if (this.images[i].image_id === image_id) {
                    this.setCurrentImage(i, skipThing);
                    found=true;
                    break;
                }
            }
        }
        if (!found) {
            this.setCurrentImage(null, true);
        }
    }
    CurrentTypes.prototype.setCurrentThingId = function(thing_id, skipImage) {
        if(this.things){
            var found=this.getCurrentThingId() === thing_id;
            if (thing_id && !found) {
                for (var i=0; i< this.things.length; i++) {
                    if (this.things[i].thing_id === thing_id) {
                        this.setCurrentThing(i, skipImage);
                        found=true;
                        break;
                    }
                }
            }
            if (!found) {
                this.setCurrentThing(null, true);
            }
        }

    }
    CurrentTypes.prototype.setCurrentSubjectId = function(thing_id, image_id) {
        console.log("setCurrentSubject", thing_id, image_id);
        this.setCurrentThingId(thing_id, true);
        this.setCurrentImageId(image_id, true);
    }


     CurrentTypes.prototype.filterImagesForThing= function(){
        var imagesForThing=[];
        if  (this){
            if(this.getCurrentThing())
                var thing=this.getCurrentThing();{
                var image;
                if(thing){
                    for (var i=0; i<this.images.length; i++) {
                        image=this.images[i];
                        if (image.thing_id === thing.id ) {
                            imagesForThing.push(image);
                        }
                    }
                }
            }
        }

        return imagesForThing;
    }




})();