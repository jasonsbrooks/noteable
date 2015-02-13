$(document).ready(function() {
	$('.French').hide();
	setTimeout(function() {
     	$('#fake-box').fadeOut(function() {
     		$('.French').fadeIn();
     	});
	}, 6000);

});

