$(document).ready(function() {
	$('#save-contents-form').ajaxForm({
		beforeSubmit: function(formData, formObject, formOptions) {
			formData.push(
				{name: 'contents', value: editor.getHTML()}
				);
		},
		success: function(html, status, xhr, myForm) {
			console.log("successful");
		}
	});

	$("#document-title-form").ajaxForm({
		success: function(html, status, xhr, myForm) {
			console.log("successful");
		}
	});

	$("#document-name").focus(function() {
		console.log('in');
	}).blur(function() {
	    $('#document-title-form').submit();
	});

	$('#tokenfield').tokenfield({
		autocomplete: {
			delay: 100
		},
		showAutocompleteOnFocus: true
	});

	$("#shareShareButton").click(function() {
		$("#shareModal").modal("hide");

	});

	$('#shareModal').on('hidden.bs.modal', function () {
		$(".token").remove();
	});

	

	$('.French').hide();
	var module = editor.addModule('multi-cursor', {
	  timeout: 1000000
	});
	setTimeout(function() {
		var text = "Alice in Wonderland Party: And so it was indeed: she was now only ten inches high, and her face brightened up at the thought that she was now the right size for going through the little door into that lovely garden. First, however, she waited for a few minutes to see if she was going to shrink any further:";
		var thang = $('#ql-line-1').html();
		var letters = ""; 
		var frodoIndex = 0;
		printText();

		function printText(){
			letter = text.split('')[frodoIndex];
			    //we add the letter to the container
			    letters = letters + letter;
			    frodoIndex++;
			    $('#ql-line-1').html(letters+thang);
			module.setCursor('id-1234', editor.getLength(), 'Minh', 'rgb(255, 0, 255)');
			   if (frodoIndex < text.length) 
			   {
			   setTimeout(printText, 300*Math.random());
		   }
		}

	}, 20000);

	setTimeout(function() {
		module.setCursor('id-1234', 0, 'Minh', 'rgb(255, 0, 255)');
	}, 15000);

	

});

