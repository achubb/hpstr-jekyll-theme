---
layout: post
title: A Basic Refactoring Example
description: "An example of some everyday Javascript refactoring"
modified: 2014-07-20
tags: [javacript, jQuery]
image:
  feature: abstract-3.jpg
  credit: dargadgetz
  creditlink: http://www.dargadgetz.com/ios-7-abstract-wallpaper-pack-for-iphone-5-and-ipod-touch-retina/
comments: true
share: true
---

The reason for this post is really to give a more, day-to-day, smaller example of where you might want to take the opportunity to refactor some code, and do a bugfix at the same time! In this case it is a simple Javacript/jQuery function, and the goal is to fix the bug, but also improve the function in any way we can. I was presented with the following bug to fix on a site that I haven't really worked on.

The bug was reported as simply "External Links not opening in new window". On further investigation the issue was related to some Javascript associated with links that were given an "external" class. On locating and opening the function associated with this, this is what I was presented with:

	{% highlight javascript %}
	$('a').each(function() {
     linkElement = $(this);
     if (linkElement.hasClass("external")) {
         linkElement.on("click", function(e) {
             e.preventDefault();
             e.stopPropagation();
             linkHref = $(this).attr("href");
             console.log(linkHref);
             ('#externalSiteAlert').modal({
                 modal: 'static',
                 keyboard: true,
                 show: true
             });
             $('#externalSiteAlert').find('#externalSiteAlertYes').on('click', function(e) {
                 // window.location.href = linkElement.attr("href");
                 e.stopPropagation();
                 var newHref = linkHref
                 // console.log(newHref);
                 $('#externalSiteAlert').modal('hide');
                     window.open(newHref, '_blank');
                 });
             });
     	}
	});
	{% endhighlight %}

OK, so just to break down what is going on here, it looks as though the this function is designed to run on all links that have a class of "external", the href value of the link is being cahced in a variable called "linkHref". Clicking on the link invokes a bootstrap modal, then within this modal we are listening for another click event, this time locating the "#externalSiteAlertYes" button, and opening the linkHref value that we stored before in a new window.

There were a couple of things that immediately struck me as a bit inelegant or wrong with this initial function. One is that is was just too big for something so simple. Another is that it appears to "nested", the second click function shouldn't be inside the first click function. With code like this you should look for things that immediately look incorrect, or could be done in a better way. Often a giveaway of this is these long nested functions. These are an easy win for code optimization.

The first thing we need to do is find a cleaner way of selecting the external links, there are a couple of ways to do this, but I didn't want to deviate too much from the original job spec on this one, so I stuck with selecting elements with the "external" class. I used a simple Attributes Equals Selector for this:

	{% highlight javascript %}
	$("a[class*='external']").click(function(e){
	});
	{% endhighlight %}

OK, so we have taken a chunk of code here and condensed it nicely into this selector, now the other things to deal with are the linkHref variable and the preventDefault.

We just need to add in the preventDefault (*which prevents the link from opening as it normally would*) to the click function we have created. It is safe to do this as we will always want preventDefault.

Now thinking ahead a little, we will want the linkHref variable to be accessible outside of this function, so we should set up a global variable, and then set the value of it when a link is clicked.
So now we have:

	{% highlight javascript %}
	var linkHref = null

    $("a[class*='external']").click(function(e){
        e.preventDefault();
        linkHref = $(this).attr("href");
    });
	{% endhighlight %}

OK, now the only thing left to do is invoke the modal, the code for this is OK as it is, as it is lifted straight from the bootstrap docs, the only thing I did was change the initialisation method from 'show' to 'toggle'

	{% highlight javascript %}
	var linkHref = null

    $("a[class*='external']").click(function(e){
        e.preventDefault();
        linkHref = $(this).attr("href");
        $('#externalSiteAlert').modal({
            modal: 'toggle',
            keyboard: true,
            show: true
        });
    });
	{% endhighlight %}

So now all we need to handle is opening the initial link in a new browser window, of the user hits the '#externalSiteAlertYes button. This is a separate function, so should therefore sit outside of the click function we have created. For reference this element is a button as opposed to a link. So we should write a click handler for this element. Within this we want to do two things, close the modal down, and open the link in a new window. To close the modal I simple tell it to toggle again. Then we use a simple window.open statement, and we pass in the linkHref variable that we set up before. We know we can access this variable as it is in the global scope. So to complete the function it is as follows:

	{% highlight javascript %}
	var linkHref = null

    $("a[class*='external']").click(function(e){
        e.preventDefault();
        linkHref = $(this).attr("href");
        $('#externalSiteAlert').modal({
            modal: 'toggle',
            keyboard: true,
            show: true
        });
    });
    $('#externalSiteAlertYes').on('click', function() {
        $('#externalSiteAlert').modal('toggle');
        window.open(linkHref, '_blank');
    })
	{% endhighlight %}

All right, so we have fixed the initial problem, and we have cleaned up some code in the progress. Cool. The reason I put this up here as an example is that, as a developer, sometimes the answer to a fix is to build a better solution. Yeah we could have messed around with that original code any probably would have been able to get it working as we wanted it. But with a little work we have swapped it out for something that in the long run will be better, and won't come back to bite you later on. In this case this was something that I was handed, that I didn't know much about, so didn't want to change it too much, but was able to implement a solution that satisfied all parties. Always be on the look out for little challenges like this as this is where you can really improve as a developer.