/* jshint ignore:start */

angular.module('joeyismImgurApp').directive('joeyismImgurLite', ['imgurService','cfpLoadingBar','$timeout','$window','$location', '$anchorScroll',
                                                                  function(imgurService, cfpLoadingBar, $timeout,$window,$location,$anchorScroll){
  'use strict';

  return {
    templateUrl: 'app/joeyismImgur/joeyismImgur.html',
    replace: true,

    link: function(scope, element){
      cfpLoadingBar.start();

      var imageIndex = 0,
          lengthOfImageArray,
          galleryIndex = 0;
      scope.datas = [];

      scope.$watch(function(){
        return $window.innerWidth;
      }, function(value) {
        scope.padding = value > 1000 ? 200: Math.min(0,value - 800);
      });

      var getImages = function() {
        imgurService.getGallery(galleryIndex).then(function(data) {
          scope.datas = scope.datas.concat(data.data.data);
          lengthOfImageArray = scope.datas.length;
          scope.datas.forEach(function(data) {
            data.subtitle = [data.subtitle];
            data.description = [data.description];
            if (data.images_count) {
              data.link = [];
              data.subtitle = [];
              data.description = [];
              imgurService.getAlbum(data.id).then(function(album) {
                consoel.log(album, 'album');
                album.data.images.forEach(function(image) {
                  data.link.push(image.link);
                    data.subtitle.push(image.title || "");
                    data.description.push(image.description || "");
                });
              });
              imgurService.getComments('album/', data.id).then(function(comments) {
                data.comments= comments.data;
              });
            } else {
              data.link = [data.link];
              imgurService.getComments('image/', data.id).then(function(comments) {
                data.comments = comments.data;
              });
            }
          });
          scope.thisData = scope.datas[imageIndex];
        });
      };

      getImages();

      scope.next = function(){
        cfpLoadingBar.start();
        imageIndex++;
        if (imageIndex === lengthOfImageArray){
          scope.datas=[];
          imageIndex = 0;
          galleryIndex++;
          getImages();
        } else {
          scope.thisData = scope.datas[imageIndex];
        }
        goToTop();
      };


      scope.prev = function(){
        if (galleryIndex >= 0){
          if (imageIndex >= 0){
            cfpLoadingBar.start();
            imageIndex--;
            scope.thisData = scope.datas[imageIndex];
            $timeout(function(){
              cfpLoadingBar.complete();
            },1);
          }
        }
        goToTop();
      };

      scope.$on('my:keydown', function(event, keyEvent) {
        if (keyEvent.keyCode===39){
          scope.next();
        } else if (keyEvent.keyCode===37){
          scope.prev();
        }
      });

      var goToTop = function(){
        $location.hash('top');
        $anchorScroll();
      };


      //      scope.skip= function(){
      //        imageIndex = lengthOfImageArray-3;
      //      };
    }
  };
}]);
angular.module('joeyismImgurApp').directive('imageonload',['cfpLoadingBar', function(cfpLoadingBar) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                //alert('image is loaded');
              cfpLoadingBar.complete();
            });
        }
    };
}]);

angular.module('joeyismImgurApp').service('imgurService', ['$http',  function($http) {
  var IMGUR_GALLERY = 'https://api.imgur.com/3/gallery/hot/viral/',
    ALBUM = 'https://api.imgur.com/3/album/',
    COMMENTS = '/comments/best';

  function galleryRequest(index) {
    return $http({
      method: 'GET',
      url: IMGUR_GALLERY + index + '.json'
    });
  }

  function albumRequest(id) {
    console.log(ALBUM + id);
    return $http({
      method: 'GET',
      URL: ALBUM + id
    });
  }

  function commentsRequest(type, id) {
    return $http({
      method: 'GET',
      URL: 'https://api.imgur.com/3/' + type + id + COMMENTS
    });
  }

  this.getGallery = function(index) {
    return galleryRequest(index);
  };

  this.getAlbum = function(id) {
    return albumRequest(id);
  }

  this.getComments = function(type, id) {
    return commentsRequest(type, id);
  };
}])