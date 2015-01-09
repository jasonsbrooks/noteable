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
	})
});