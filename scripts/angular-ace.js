angular.module('ace', []).directive('ace', function() {
  var ACE_EDITOR_CLASS = 'ace-editor';

  function loadAceEditor(element, mode) {
    var editor = ace.edit($(element).find('.' + ACE_EDITOR_CLASS)[0]);
    editor.session.setMode("ace/mode/" + mode);
    editor.renderer.setShowPrintMargin(false);

    return editor;
  }

  function valid(editor) {
    return (Object.keys(editor.getSession().getAnnotations()).length == 0);
  }

  return {
    restrict: 'A',
    require: '?ngModel',
    transclude: true,
    template: '<div class="transcluded" ng-transclude></div><div class="' + ACE_EDITOR_CLASS + '"></div>',

    link: function(scope, element, attrs, ngModel) {
      var textarea = $(element).find('textarea');
      textarea.hide();

      var mode = attrs.ace;
      var editor = loadAceEditor(element, mode);

      scope.ace = editor;

      if (!ngModel) {
	  return; // do nothing if no ngModel
	  }

      ngModel.$render = function() {
        var value = ngModel.$viewValue || '';
        editor.getSession().setValue(value);
        textarea.val(value);
      };
		if (mode == "javascript") {
		  editor.getSession().on('change', function() {
			
			if (valid(editor)) {
			  scope.$apply(read);
			} else {
				// exception handling here
			}
		  });
		}
      editor.getSession().setValue(textarea.val());
      read();
	
      function read() {
	  
		var righteditor = loadAceEditor($('#righteditor'), 'javascript');
        ngModel.$setViewValue(editor.getValue());
        textarea.val(editor.getValue());
		// wrap all JavaScript code into eval block for syntax validation
		try {
		    $("#error").html("");
			$("#error").hide();
			eval ("(function () {" + editor.getValue() + "})(jQuery);");
		} catch (e) {
			// Errors found.
			// Set error div content to exception details
			$("#error").html("" + e);
            $("#error").show();
			return;
		}
		// set right side editor content same as left side editor
		righteditor.getSession().setValue(editor.getValue());
      }
    }
  }
});