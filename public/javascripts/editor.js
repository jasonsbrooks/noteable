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
});