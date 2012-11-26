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
        | \JavaScript
            $ \#js2ls .show!
            $ \#cs2ls .hide!
        | \CoffeeScript
            $ \#cs2ls .show!
            $ \#js2ls .hide!
            $ \#left_arrow .hide!

    $scope.lsChangeHandler = ->
        $scope.righteditor_changed = true
        ls = $scope.js2lsrighteditor.getValue!
        js = ''
        try js = coffee2ls.ls2js ls
        catch e
            $ \#js2lserror
                ..html ''
                ..append $(\<pre/>).css('text-align', 'left').text e
                ..show!
            return
        $scope.js2lslefteditor.get-session!setValue js
        $scope.js2lsrighteditor.focus!
        $ \#left_arrow .hide!
        $scope.righteditor_changed = false

angular.module \myapp <[ ace ]>
