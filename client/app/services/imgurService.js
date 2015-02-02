/* jshint ignore:start */

imgurApp.service('imgurService', ['$http',  function($http) {
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
  };

  this.getComments = function(type, id) {
    return commentsRequest(type, id);
  };

}]);