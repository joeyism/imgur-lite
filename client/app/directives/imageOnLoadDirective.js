/* jshint ignore:start */

imgurApp.directive('imageonload',['cfpLoadingBar', function(cfpLoadingBar) {
	'use strict';
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