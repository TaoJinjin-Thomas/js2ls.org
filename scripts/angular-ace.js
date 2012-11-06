angular.module('ace', []).directive('ace', function() {
  var ACE_EDITOR_CLASS = 'ace-editor';

  function loadAceEditor(element, mode, useWorker) {
    var editor = ace.edit($(element).find('.' + ACE_EDITOR_CLASS)[0]);
    editor.session.setMode("ace/mode/" + mode);
    editor.session.setUseWorker(useWorker);
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
      var editor = loadAceEditor(element, mode, true);
	  var editor_id = attrs.id;

      scope.ace = editor;

      if (!ngModel) {
	  return; // do nothing if no ngModel
	  }
      ngModel.$render = function() {
        var value = ngModel.$viewValue || '';
        editor.getSession().setValue(value);
        textarea.val(value);
      };
		  editor.getSession().on('change', function() {
			
			if (valid(editor)) {
			  scope.$apply(read);
			} else {
				// exception handling here
			}
		  });
      editor.getSession().setValue(textarea.val());
      read();
	
      function read() {
		var err;
		if (editor_id == 'lefteditor') {
			err = '#error';
          scope.righteditor = scope.righteditor || loadAceEditor($('#righteditor'), 'coffee', false);
		} else if (editor_id == 'lefteditor1') {
			err = '#error1';
		  scope.righteditor1 = scope.righteditor1 || loadAceEditor($('#righteditor1'), 'coffee', false);
        }
		
		ngModel.$setViewValue(editor.getValue());
        textarea.val(editor.getValue());
		// wrap all JavaScript code into eval block for syntax validation
        var cs = '';
		if (editor_id == 'lefteditor1') {
		    $(err).html("");
            $(err).hide();
			cs = editor.getValue();
		} else if (editor_id == 'lefteditor') {
		try {
		    $(err).html("");
            $(err).hide();
			cs = Js2coffee.build(
                        editor.getValue()
                    );
		} catch (e) {
                    $(err).html("" + e);
                    $(err).show();
                }
		}
                var ls = '';
		try {
                    ls = coffee2ls.compile( coffee2ls.parse( cs ) );
		} catch (e) {
			// Errors found.
			// Set error div content to exception details
                        $(err).html("");
                        $(err).append($('<pre/>').css('text-align', 'left').text(e));
                        $(err).show();
			return;
		}
		// set right side editor content same as left side editor
				if (editor_id == 'lefteditor') {
					scope.righteditor.getSession().setValue(ls);
				} else if (editor_id == 'lefteditor1') {
					scope.righteditor1.getSession().setValue(ls);
				}
      }
    }
  }
});
