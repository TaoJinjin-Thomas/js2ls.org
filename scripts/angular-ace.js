angular.module('ace', []).directive('ace', function() {
  var ACE_EDITOR_CLASS = 'ace-editor';

  function loadAceEditor(element, mode, isReadOnly) {
    var editor = ace.edit($(element).find('.' + ACE_EDITOR_CLASS)[0]);
    editor.session.setMode("ace/mode/" + mode);
    editor.renderer.setShowPrintMargin(false);
	editor.setReadOnly(isReadOnly);

    return editor;
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
      var editor;
	  var editor_id = attrs.id;
	  if (editor_id == 'js2lslefteditor' || editor_id == 'js2lsrighteditor' || editor_id == 'cs2lslefteditor') {
	    editor = loadAceEditor(element, mode, false);
	  } else if (editor_id == 'cs2lsrighteditor') {
	    editor = loadAceEditor(element, mode, true);
	  }
	  var err;
	  if (editor_id == 'js2lslefteditor' || editor_id === 'js2lsrighteditor') {
		err = '#js2lserror';
	  } else if (editor_id == 'cs2lslefteditor' || editor_id === 'cs2lsrighteditor') {
	    err = '#cs2lserror';
      }

      scope.ace = editor;
	  if (editor_id === 'js2lsrighteditor') {
	    scope.js2lsrighteditor = editor;
	  } else if (editor_id === 'cs2lsrighteditor') {
	    scope.cs2lsrighteditor = editor;
	  } else if (editor_id === 'js2lslefteditor') {
	    scope.js2lslefteditor = editor;
	  } else if (editor_id === 'cs2lslefteditor') {
	    scope.cs2lslefteditor = editor;
	  }

      if (!ngModel) {
		// right hand side editors wont have ng-model
		// We should register onchange event handler for js2ls right hand side editor only
		read();
		if (editor_id === 'js2lsrighteditor') {
		  editor.getSession().on('change', rightEditorChangeHandler);
		}
		return;
	  }
      ngModel.$render = function() {
        var value = ngModel.$viewValue || '';
        editor.getSession().setValue(value);
        textarea.val(value);
      };

      editor.getSession().on('change', leftEditorChangeHandler);

      editor.getSession().setValue(textarea.val());
      read();

	  // Right Editor Change Handler only for js2ls
	  function rightEditorChangeHandler() {
	    $('#left_arrow').css('display', 'block');
	  }
	  
	  // Left Editor Change Handler for both js2ls and cs2ls
	  function leftEditorChangeHandler() {
		scope.$apply(read);
	  }
	  
      function read() {
		if (ngModel) {
		  ngModel.$setViewValue(editor.getValue());
		  textarea.val(editor.getValue());
        }
		
		
		// wrap all JavaScript code into eval block for syntax validation
        var cs = '';
		$(err).html("");
        $(err).hide();
		if (editor_id == 'cs2lslefteditor') {
		  cs = editor.getValue();
		} else if (editor_id == 'js2lslefteditor') {
		  try {
			cs = Js2coffee.build(
              editor.getValue()
            );
		  } catch (e) {
            $(err).html("" + e);
            $(err).show();
          }
		} else if (editor_id == 'js2lsrighteditor') {
          try {
			cs = Js2coffee.build(
              scope.js2lslefteditor.getValue()
            );
		  } catch (e) {
            $(err).html("" + e);
            $(err).show();
          }		
		} else if (editor_id === 'cs2lsrighteditor') {
		  cs = scope.cs2lslefteditor.getValue();
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
		if (editor_id == 'js2lslefteditor' || editor_id === 'js2lsrighteditor') {
		  if (editor_id == 'js2lslefteditor' && scope.righteditor_changed == true) {
		    // Nothing to do here
			// because this is simulated as JS2LS left editor is updated due to left-arrow button click
		  } else {
		    scope.js2lsrighteditor.getSession().setValue(ls);
			// always make sure left-arrow is hidden, right hand side editor change event enable it whenever required.
			$('#left_arrow').css('display', 'none');
		  }
		  scope.righteditor_changed == false;
		} else if (editor_id == 'cs2lslefteditor' || editor_id === 'cs2lsrighteditor') {
		  scope.cs2lsrighteditor.getSession().setValue(ls);
		}
      }
    }
  }
});