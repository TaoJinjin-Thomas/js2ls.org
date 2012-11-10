<- (angular.module \ace []).directive \ace

loadAceEditor = (element, mode, isReadOnly) ->
    editor = window.ace.edit (($ element).find '.' + ACE_EDITOR_CLASS).0
    editor.session.setMode "ace/mode/#mode"
    editor.renderer.setShowPrintMargin false
    editor.setReadOnly isReadOnly
    editor

const ACE_EDITOR_CLASS = 'ace-editor'

return {
    restrict: 'A'
    require: '?ngModel'
    transclude: true
    template: '<div class="transcluded" ng-transclude></div><div class="' + ACE_EDITOR_CLASS + '"></div>'
    link: (scope, element, attrs, ngModel) ->
        rightEditorChangeHandler = -> ($ '#left_arrow').css 'display', 'block'
        leftEditorChangeHandler = -> read!
        read = ->
            if ngModel
                ngModel.$setViewValue editor.getValue!
                textarea.val editor.getValue!
            cs = ''
            ($ err).html ''
            ($ err).hide!
            switch editor_id
                case \cs2lslefteditor
                    cs = editor.getValue!
                case \js2lslefteditor
                    try
                        cs = Js2coffee.build editor.getValue!
                    catch e
                        ($ err).html '' + e
                        ($ err).show!
                case \js2lsrighteditor
                    try
                        cs = Js2coffee.build scope.js2lslefteditor.getValue!
                    catch e
                        ($ err).html '' + e
                        ($ err).show!
                case \cs2lsrighteditor
                    cs = scope.cs2lslefteditor.getValue!
            ls = ''
            try
                ls = coffee2ls.compile coffee2ls.parse cs
            catch e
                ($ err).html ''
                ($ err).append (($ '<pre/>').css 'text-align', 'left').text e
                ($ err).show!
                return
            switch editor_id
                case <[ js2lslefteditor js2lsrighteditor ]>
                    unless (editor_id is 'js2lslefteditor' and scope.righteditor_changed)
                        try scope.js2lsrighteditor.getSession!.setValue ls
                        ($ '#left_arrow').css 'display', 'none'
                    scope.righteditor_changed is false
                case <[ cs2lslefteditor cs2lsrighteditor ]>
                    try scope.cs2lsrighteditor.getSession!.setValue ls
        textarea = ($ element).find 'textarea'
        textarea.hide!
        mode = attrs.ace
        editor = void
        editor_id = attrs.id
        switch editor_id
            case <[ js2lslefteditor js2lsrighteditor cs2lslefteditor ]>
                editor = loadAceEditor element, mode, false
            case \cs2lsrighteditor
                editor = loadAceEditor element, mode, true

        err = void
        switch editor_id
            case <[ js2lslefteditor js2lsrighteditor ]>
                err = '#js2lserror'
            case <[ cs2lslefteditor cs2lsrighteditor ]>
                err = '#cs2lserror'

        scope.ace = scope[editor_id] = editor

        unless ngModel
            read!
            if editor_id is 'js2lsrighteditor'
                editor.getSession!.on 'change', rightEditorChangeHandler
            return

        ngModel.$render = ->
            value = ngModel.$viewValue || ''
            editor.getSession!.setValue value
            textarea.val value
        editor.getSession!.on \change leftEditorChangeHandler
        editor.getSession!.setValue textarea.val!
        read!
}
