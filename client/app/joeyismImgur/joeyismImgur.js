/* jshint ignore:start */

angular.module('joeyismImgurApp').directive('joeyismImgurLite',['$http','cfpLoadingBar','$timeout','$window', function($http, cfpLoadingBar, $timeout,$window){
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
        console.log(value);
      });

      var getImages = function(){
        $http.get('https://api.imgur.com/3/gallery/hot/viral/'+galleryIndex+'.json').success(function(data){
          scope.datas = scope.datas.concat(data.data);
          lengthOfImageArray = scope.datas.length;
          scope.datas.forEach(function(data){
            if (data.images_count){
              $http.get('https://api.imgur.com/3/album/'+data.id).success(function(album){
                data.link=[];
                album.data.images.forEach(function(image){
                  data.link.push(image.link);
                });
              })
              .error(function(err){
                console.log(err);
              });
            }
            else {
              data.link = [data.link];
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
        $timeout(function(){
          cfpLoadingBar.complete();
        },1);
      };

      scope.prev = function(){
        if (imageIndex > 0){
          cfpLoadingBar.start();
          imageIndex--;
          scope.thisData = scope.datas[imageIndex];
          $timeout(function(){
            cfpLoadingBar.complete();
          },1);
        }

      };

      element.bind('load', function() {
        cfpLoadingBar.complete();
      });
      scope.$on('my:keydown', function(event, keyEvent) {
        if (keyEvent.keyCode===39){
          scope.next();
        } else if (keyEvent.keyCode===37){
          scope.prev();
        }
      });


      //      scope.skip= function(){
      //        imageIndex = lengthOfImageArray-3;
      //      };
    }
  };
}]);
