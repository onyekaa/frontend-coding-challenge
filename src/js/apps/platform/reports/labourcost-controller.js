"use strict";

/******************************************************************************************

Labour Cost Report controller

******************************************************************************************/

var app = angular.module("labourcost.controller", []);

app.controller("ctrlLabourCost", ["$rootScope", "$scope", "$filter", "$animate", "$timeout", "restalchemy", "navigation", 
	function LabourCostCtrl($rootScope, $scope, $filter, $animate, $timeout, $restalchemy, $navigation) {
	// Set the navigation tabs
	$navigation.select({
		forward: "reports",
		selected: "labourreport"
	});
	// Initialise the REST api
	var rest = $restalchemy.init({ root: $rootScope.config.api.labourstats.root });
	rest.api = $rootScope.config.api.labourstats;

	rest.at(rest.api.costs).get().then(function(costdata) {
		// For styling purposes we separate the providers, direct contractors
		// and total into seperate scopes.
		$scope.providers = costdata[0].providers;
		$scope.total = costdata[0].total[0];
		$scope.directContractors = costdata[0].directContractors[0];
		
	});

	$scope.column = 'name';
	$scope.desc = false;

	// Sorting function trigged on header click.
	$scope.sort = function(column, $event) {
		// filter for the Direct Contractor object, we're making the assumption
		// that this column name will not change
		var findDirect = $filter('filter')($scope.providers, {name: 'Direct Contractors'}, true);

		// If you're filtering any column but 'name', push the object
		// into the scope so it can be sorted.
		if (column != 'name' && !findDirect.length) {
			$scope.providers.push($scope.directContractors);
		}
		// If you're filtering the name column, remove the Direct 
		// Contractors from the scope. 
		if (column === 'name' && findDirect.length){ 
			$scope.providers.splice($scope.providers.indexOf(findDirect ));
		}

		// Condition to check if the column clicked is already in the column scope
		// If it is, reverse the sort direction, else, set to true.
		$scope.desc = ($scope.column === column) ? !$scope.desc : false;
		$scope.column = column;

	};
}]);
