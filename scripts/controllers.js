angular.module('myapp', ['ace']);
function TabCtrl ($scope) {
	$scope.currentTab = 'JavaScript';
	$('#js2ls').css('display', 'block');
	$('#cs2ls').css('display', 'none');
	$('#left_arrow').css('display', 'none');
	$scope.tabs = [{name: "JavaScript", selected: true, mode: "javascript"}, {name: "CoffeeScript", selected: false, mode:"coffee"}];
	// Handler for toggle tabs
	$scope.toggleTab = function(tabName) {
		if ($scope.currentTab === tabName) {
			return;
		} else {
			if ($scope.currentTab === 'JavaScript') {
				$scope.currentTab = 'CoffeeScript';
			} else if ($scope.currentTab === 'CoffeeScript') {
				$scope.currentTab = 'JavaScript';
			}
		}
		angular.forEach($scope.tabs, function(tab) {
			if ($scope.currentTab == tab.name) {tab.selected = true;} else {tab.selected = false;}
		});
		
		if ($scope.currentTab === 'JavaScript') {
			$('#js2ls').css('display', 'block');;
			$('#cs2ls').css('display', 'none');
		} else if ($scope.currentTab === 'CoffeeScript') {
			$('#cs2ls').css('display', 'block');;
			$('#js2ls').css('display', 'none');
			$('#left_arrow').css('display', 'none');
		}
	};
	
	// Handler for livescript editor text change in js2ls
	$scope.lsChangeHandler = function () {
	    // left-arrow click means manual edit of js2ls right editor
		// So set right editor changed flag to true
	    $scope.righteditor_changed = true;
		
        var ls = $scope.js2lsrighteditor.getValue();
		var js='';
		try {
          js = coffee2ls.ls2js(ls);
		} catch (e) {
		  // Errors found.
		  // Set error div content to exception details
          $('#js2lserror').html("");
          $('#js2lserror').append($('<pre/>').css('text-align', 'left').text(e));
          $('#js2lserror').show();
		  return;
		}
		
		$scope.js2lslefteditor.getSession().setValue(js);
		$('#left_arrow').css('display', 'none');
		
		// We are done all relevant action of left-arrow click
		// Further more changes to js2ls right editor are simulated changes from left editor manual edit
		// So set right editor change flag to false
		$scope.righteditor_changed = false;

	};
}