/* jshint ignore:start */

angular.module('joeyismImgurApp').directive('joeyismImgurLite',['$http','cfpLoadingBar','$timeout','$window','$location', '$anchorScroll',
                                                                  function($http, cfpLoadingBar, $timeout,$window,$location,$anchorScroll){
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

      var getImages = function(){
        $http.get('https://api.imgur.com/3/gallery/hot/viral/'+galleryIndex+'.json').success(function(data){
          scope.datas = scope.datas.concat(data.data);
          lengthOfImageArray = scope.datas.length;
          scope.datas.forEach(function(data){
            data.subtitle=[data.subtitle];
            data.description = [data.description];
            if (data.images_count){
              data.link=[];
              data.subtitle=[];
              data.description=[];
              $http.get('https://api.imgur.com/3/album/'+data.id).success(function(album){
                album.data.images.forEach(function(image){
                  data.link.push(image.link);
                  data.subtitle.push(image.title || "");
                  data.description.push(image.description || "");
                });
              })
              .error(function(err){
                console.log(err);
              });
              $http.get('https://api.imgur.com/3/gallery/album/'+data.id+'/comments/best').success(function(comments){
                data.comments= comments.data;
              });
            }
            else {
              data.link = [data.link]
              $http.get('https://api.imgur.com/3/gallery/image/'+data.id+'/comments/best').success(function(comments){
                data.comments= comments.data;
              });
            }
          });
          scope.thisData = scope.datas[imageIndex];
        })
        .error(function(err){
          console.log(err);
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
