CalendarApp.controller('ModalController', function($scope, dailyEventObj, close, toastr, yearMonthKey) {
	$scope.dailyEventObj = dailyEventObj;
	$scope.currentEvents = [];

	//For Current Event, we must push the elements one by one again so that the array does not pass by reference
	angular.forEach(dailyEventObj.events, function(event){
		var newEvent = new Event();
		newEvent.processJSON(event);
		$scope.currentEvents.push(newEvent);
	})

	$scope.close = function() {
		close(dailyEventObj);
	};

	$scope.addNewEvent = function(){
		$scope.currentEvents.push(new Event());
	}

	$scope.updatedailyEventObj = function(){
		var allEventsValid = true;

		angular.forEach($scope.currentEvents, function(event){
			if(!event.validate()){
				allEventsValid = false;
			}
		});

		if(allEventsValid){
			dailyEventObj.events = $scope.currentEvents;

			//save to localStorage
			localStorage.setItem(yearMonthKey, JSON.stringify($scope.events));

			toastr.success('Events updated!');
			close(dailyEventObj);
		}
	}

	$scope.removeEvent = function(index){
		$scope.currentEvents.splice(index, 1);
	}
});