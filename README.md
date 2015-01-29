# Imgur-lite

WORKING, BUT STILL WORK IN PROGRESS

This is meant to be a light-weight Imgur app, which is mobile friendly. I was tired of using imgur on mobile and have images not load

To run this, first install files by running

> sudo npm install && bower install

> grunt

To run the app, use node by

> node server/app.js

To add this app to your own website, run

> grunt dist

and copy the dist file over to your website, then add

    <div joeyism-imgur-lite></div>


to run imgur-lite. Also put

> ng-keydown="$broadcast('my:keydown', $event)" ng-swipe-left="$broadcast('my:keydown',{keyCode:37})" ng-swipe-right="$broadcast('my:keydown',{keyCode:39})"

on your <body> tag such that

    <body ng-app="myApp" ng-keydown="$broadcast('my:keydown', $event)" ng-swipe-left="$broadcast('my:keydown',{keyCode:37})"
        ng-swipe-right="$broadcast('my:keydown',{keyCode:39})">

to browse with your left and right key. Don't include it if you don't want to use the left and right key to browse back and forth.
