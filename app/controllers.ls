window.TabCtrl = ($scope) ->
    $scope.currentTab = \JavaScript

    $ \#js2ls .show!
    $ \#cs2ls .hide!
    $ \#left_arrow .hide!

    $scope.tabs =
        * { name: \JavaScript   mode: \javascript,   +selected }
        * { name: \CoffeeScript mode: \coffee,       -selected }

    $scope.toggleTab = (tabName) ->
        return if $scope.currentTab is tabName
        $scope.currentTab = tabName
        angular.forEach $scope.tabs, (tab) ->
            tab.selected = ($scope.currentTab is tab.name)
        switch $scope.currentTab
            case \JavaScript
                $ \#js2ls .show!
                $ \#cs2ls .hide!
            case \CoffeeScript
                $ \#cs2ls .show!
                $ \#js2ls .hide!
                $ \#left_arrow .hide!

    $scope.lsChangeHandler = ->
        $scope.righteditor_changed = true
        ls = $scope.js2lsrighteditor.getValue!
        js = ''
        try
            js = coffee2ls.ls2js ls
        catch e
            $ \#js2lserror
                ..html ''
                ..append $(\<pre/>).css('text-align', 'left').text e
                ..show!
            return
        $scope.js2lslefteditor.getSession!setValue js
        $scope.righteditor_changed = false
        $ \#left_arrow .fadeOut \fast
        $scope.js2lsrighteditor.focus!

angular.module \myapp <[ ace ]>
