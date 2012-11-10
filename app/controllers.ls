window.TabCtrl = ($scope) ->
    $scope.currentTab = 'JavaScript'
    ($ '#js2ls').css 'display', 'block'
    ($ '#cs2ls').css 'display', 'none'
    ($ '#left_arrow').css 'display', 'none'
    $scope.tabs = [{name: "JavaScript", selected: true, mode: "javascript"}, {name: "CoffeeScript", selected: false, mode:"coffee"}];
    $scope.toggleTab = (tabName) ->
        if $scope.currentTab is tabName
            return
        else if $scope.currentTab is 'JavaScript'
            $scope.currentTab = 'CoffeeScript'
        else if $scope.currentTab is 'CoffeeScript'
            $scope.currentTab = 'JavaScript'
        angular.forEach $scope.tabs, (tab) ->
            tab.selected = ($scope.currentTab is tab.name)
        if $scope.currentTab is 'JavaScript'
            ($ '#js2ls').css 'display', 'block'
            ($ '#cs2ls').css 'display', 'none'
        else if $scope.currentTab is 'CoffeeScript'
            ($ '#cs2ls').css 'display', 'block'
            ($ '#js2ls').css 'display', 'none'
            ($ '#left_arrow').css 'display', 'none'
    $scope.lsChangeHandler = ->
        $scope.righteditor_changed = true
        ls = $scope.js2lsrighteditor.getValue!
        js = ''
        try
            js = coffee2ls.ls2js ls
        catch e
            ($ '#js2lserror').html ''
            ($ '#js2lserror').append (($ '<pre/>').css 'text-align', 'left').text e
            ($ '#js2lserror').show!
            return
        $scope.js2lslefteditor.getSession!setValue js
        ($ '#left_arrow').css 'display', 'none'
        $scope.righteditor_changed = false

angular.module 'myapp', ['ace']
