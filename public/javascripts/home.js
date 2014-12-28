$(document).ready(function(){
	

    $.fn.fullpage({
            anchors: ['home', 'analytics', 'interface'],
            onLeave: function(index, direction){
	            //after leaving section 2
	            if(index == '1' && direction =='down'){
                 //    console.log("got here");
	                // $("#links-container").css("color", "black");
                 //    $(".header-sign").removeClass("header-sign").addClass("header-sign-lower");
	            }

	            else if(index == '2' && direction == 'up'){
	                // $("#links-container").css("color", "white");
                 //    $(".header-sign-lower").removeClass("header-sign-lower").addClass("header-sign");
	            }
	        }
            // navigation: true,
            // navigationPosition: 'right',
            // navigationTooltips: ['Home', 'Video', 'White Paper', 'MAC Address Lookup'],
            // resize: true,
            // easing: 'linear',
            // scrollingSpeed: 400,
            // autoScrolling: false
    });
});

