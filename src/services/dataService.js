CalendarApp.service('DataService', function($http) {
	this.getYearMonthList = function(){
		return $http.get('./data/yearMonth.json');
	}

	this.getEventList = function(){
		return $http.get('./data/event.json');
	}
})