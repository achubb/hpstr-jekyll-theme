/*! Plugin options and other jQuery stuff */

// dl-menu options
$(function() {
  $( '#dl-menu' ).dlmenu({
    animationClasses : { classin : 'dl-animate-in', classout : 'dl-animate-out' }
  });
});

// FitVids options
$(function() {
  $("article").fitVids();
});

$(".close-menu").click(function () {
  $(".menu").toggleClass("disabled");
  $(".links").toggleClass("enabled");
});

$(".about").click(function () {
  $("#about").css('display','block');
});

$(".close-about").click(function () {
  $("#about").css('display','');
});

// Check if in view
function isScrolledIntoView(elem) {
    var $window = $(window),
        docViewTop = $window.scrollTop(),
        docViewBottom = docViewTop + $window.height(),
        elemTop = $(elem).offset().top,
        elemBottom = elemTop + $(elem).outerHeight();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

// Progress Bars

$(window).on("scroll", function() {

$('.bar-percentage[data-percentage]').each(function () {

	if ( isScrolledIntoView(this) && !$(this).hasClass("count-complete") ) {
	
		var progress = $(this);
	  	var percentage = Math.ceil($(this).attr('data-percentage'));
  
	  	$({countNum: 0}).animate({countNum: percentage}, {
	    	duration: 2000,
	    	easing:'linear',				
	    	step: function() {
	      		// What todo on every count
	    		var pct = '';
	    		if(percentage == 0){
	      			pct = Math.floor(this.countNum) + '%';
	    		}else{
	      			pct = Math.floor(this.countNum+1) + '%';
	    		}
	    		progress.text(pct) && progress.siblings().children().css('width',pct);
	    	}
	  	});

  		$(this).addClass("count-complete");

  	}

});

});
