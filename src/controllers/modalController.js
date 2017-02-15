CalendarApp.controller('ModalController', function($uibModalInstance, dailyEventObj, yearMonthKey) {
  	var $ctrl = this;

	$ctrl.dailyEventObj = dailyEventObj;
	$ctrl.currentEvents = [];

	//For Current Event, we must push the elements one by one again so that the array does not pass by reference
	angular.forEach(dailyEventObj.events, function(event){
		var newEvent = new Event();
		newEvent.processJSON(event);
		$ctrl.currentEvents.push(newEvent);
	})

	$ctrl.close = function() {
	};

	$ctrl.addNewEvent = function(){
		$ctrl.currentEvents.push(new Event());
	}

	$ctrl.updatedailyEventObj = function(){
		var allEventsValid = true;

		angular.forEach($ctrl.currentEvents, function(event){
			if(!event.validate()){
				allEventsValid = false;
			}
		});

		if(allEventsValid){
			dailyEventObj.events = $ctrl.currentEvents;

			//save to localStorage
			localStorage.setItem(yearMonthKey, JSON.stringify($ctrl.events));
			$uibModalInstance.close(dailyEventObj);
		}
	}

	$ctrl.removeEvent = function(index){
		$ctrl.currentEvents.splice(index, 1);
	}
});