
CalendarApp.controller("CalendarContorller", ['$scope', '$http', 'DataService', 'CalendarService', function ($scope, $http, DataService, CalendarService) {
	//Init
	$scope.yearList = [];
	$scope.monthList = [];
	$scope.events = [];
	
	$scope.runningDateTimestamp = 0;
	$scope.calendarRows = 0;
	$scope.firstDayOfWeekForEvents = 0;
	$scope.calendarColumns = CalendarService.getColumns();
	$scope.calendarStarted = false;
	
	var date = new Date();
	$scope.year = date.getFullYear().toString();
	$scope.month = CalendarService.formatMonthToString(date.getMonth());

	DataService.getYearMonthList().success(function(data){
		$scope.yearList = data.years;
		$scope.monthList = data.months;
	});
	
	$scope.refreshCalendar = function(){
		$scope.calendarStarted = false;
	
		DataService.getEventList().success(function(data){
			$scope.events = CalendarService.reorganizeEvent($scope.year, $scope.month, data.events);
		});
	};
	$scope.refreshCalendar();

	$scope.isValidDay = function(dayOfWeek, timestamp){
		//if calendar started, valid
		if($scope.calendarStarted){
			return typeof ($scope.events[timestamp] != 'undefined');
		}
		//else, only the first day of week of the running timestamp will trigger the start
		if(new Date(parseInt(timestamp)).getDay() == dayOfWeek){
			$scope.calendarStarted = true;
			
			return (typeof $scope.events[timestamp] != 'undefined');
		} else {
			return false;
		}
	}
	
	$scope.printDay = function(timestamp){
		return CalendarService.formatToTwoDigits(new Date(parseInt(timestamp)).getDate());
	}
	
	$scope.onParamChange = function(){
		$scope.refreshCalendar();
	}
	
	$scope.getMonthDisplay = function(month){
		return CalendarService.getShortMonthText(month);
	}
}]);
