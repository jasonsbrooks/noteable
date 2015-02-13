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

	$.fn.modal.Constructor.prototype.enforceFocus = function () {
		var that = this;
		$(document).on('focusin.modal', function (e) {
			if ($(e.target).hasClass('select2-input')) {
				return true;
			}

			if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
				that.$element.focus();
			}
		});
	};



});

