/* jshint ignore:start */

imgurApp.directive('autoLinker',['$compile','$timeout', function($compile,$timeout) {
    var htmlText;
    return {
        restrict: 'EA',
        replace: true,
        link: function(scope, element) {

            $timeout(function(){
                var text = element[0].innerHTML;
                var linkTypes = ["http://", "https://"];
                linkTypes.forEach(function(linkType){
                    var startSpace = 0;
                    while (startSpace >= 0){
                        text = element[0].innerHTML;
                        var locationOfHttp = text.indexOf(linkType,startSpace);
                        if (locationOfHttp < 0) break;
                        var locationOfSpace = text.indexOf(" ",locationOfHttp);
                        var textAfter = "";
                        if (locationOfSpace < 0){
                            locationOfSpace = text.length
                        } else {
                            textAfter = text.substring(locationOfSpace,text.length);
                        }
                        var linkUrl = text.substring(locationOfHttp,locationOfSpace);
                        htmlText = text.substring(0,locationOfHttp)+'<a href="'+linkUrl+'">'+linkUrl+'</a>'+textAfter;
                        element[0].innerHTML = htmlText;
                        startSpace = (text.substring(0,locationOfHttp)+'<a href="'+linkUrl+'">'+linkUrl+'</a>').length-1;
                    }
                });
scope.$apply();
},1);
}
};
}]);