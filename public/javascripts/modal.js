$(document).ready(function() {
	var modal = $('.modal');

	$( ".btn" ).on( "click", function() {
	  $( modal ).toggleClass('modal--show');
	});

	$( ".overlay" ).on( "click", function() {
	  $( modal ).toggleClass('modal--show');
	});

	$( ".modal__close" ).on( "click", function() {
	  $( modal ).toggleClass('modal--show');
	});
});