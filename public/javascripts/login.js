$(document).ready(function() {
	$('#toggle-register').on('click', function() {
		$('#triangle').animate({marginLeft: '272px'});
		$('#login').hide();
		$('#register').show();
	});

	$('#toggle-login').on('click', function() {
		$('#triangle').animate({marginLeft: '106px'});
		$('#register').hide();
		$('#login').show();
	});
});

function register() {
	$('#triangle').css("margin-left", "272px");
	$('#login').hide();
	$('#register').show();
}