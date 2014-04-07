---
layout: post
title: Cannot read property 'offsetWidth' of null
description: "Snippet describing how to fix the Cannot read property 'offsetWidth' of null console error."
modified: 2014-04-07
tags: [snippet, javascript]
image:
  feature: abstract-3.jpg
  credit: dargadgetz
  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
comments: true
share: true
---

Just thought I'd write a quick post on this Google Maps related error. It's one of those errors that doesn't really give much away and I see this getting thrown up in consoles a lot on many sites that I visit, and for a while it puzzled me, but one I was determined to find a solution to.

## What Does It Mean?
The error basically means that your Google Maps function is trying to run when the map canvas isn't fully loaded in the DOM. Fortunately it is a relatively simple fix.

Basically you probably have a map that is getting rendered out on your page, wrapped in a JavaScript function, that is passing parameters and drawing the map. I'll use the [simple Google sample map](https://developers.google.com/maps/documentation/javascript/examples/map-simple) as an example:

  {% highlight javascript %}
  var map;
  function initialize(){
    var mapOptions ={
      zoom:8,
      center:new google.maps.LatLng(-34.397,150.644)
    };
    map =new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }

  google.maps.event.addDomListener(window,'load', initialize);
  {% endhighlight %}

This would work fine if you just happened to load this script in on the DOM ready on that particular page. You can see there in the bottom part of the function where the addDomListener event is added. This is where the code should wait for the document to finish loading, then it runs the initialize() function.

## How To Fix It
However you may have this script elsewhere. It could even be part of your main js. You need to avoid it trying to run the initialze function. As it will cause the 'offsetWidth' bug, this is because the function will try to run the initialize even if there is no canvas area on the page for the map to be rendered in.

My solution to this is to simply wrap that function in an if statement, which will return true if the canvas element that you want to render the map in is present on the page. This is useful in cases where you may have multiple maps on a page or a site, but is a simple check to make sure this code only runs if there is somewhere for the map to render. So the if statement would be:

  {% highlight javascript %}
  if ($("#map-canvas").length > 0){
  {% endhighlight %}

Or simply if the element returns a length greater than zero (which it will if it is there). Then run the initialize function. So you should end up with something like this:

  {% highlight javascript %}
  if ($("#map-canvas").length > 0){

      var map;
      function initialize(){
        var mapOptions ={
          zoom:8,
          center:new google.maps.LatLng(-34.397,150.644)
        };
        map =new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }

      google.maps.event.addDomListener(window,'load', initialize);

  }
  {% endhighlight %}