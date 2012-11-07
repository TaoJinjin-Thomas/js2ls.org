angular.module('myapp', ['ace']);
function TabCtrl ($scope) {
	$scope.currentTab = 'JavaScript';
	$('#js2ls').css('display', 'block');
	$('#cs2ls').css('display', 'none');
	$scope.tabs = [{name: "JavaScript", selected: true, mode: "javascript"}, {name: "CoffeeScript", selected: false, mode:"coffee"}];
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
		}
	};
}