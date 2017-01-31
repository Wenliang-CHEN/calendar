
CalendarApp.controller("CalendarContorller", ['toastr','$scope', '$http', '$document', 'DataService', 'CalendarService', 'ModalService',
	function (toastr, $scope, $http, $document, DataService, CalendarService, ModalService) {
	//Init
	$scope.yearList = [];
	$scope.monthList = [];
	$scope.events = [];
	
	$scope.runningDateTimestamp = 0;
	$scope.calendarRows = 0;
	$scope.firstDayOfWeekForEvents = 0;
	$scope.calendarColumns = CalendarService.getColumns();
	$scope.calendarStarted = false;
	
	var yearMonthKey = '';

	var date = new Date();
	$scope.year = date.getFullYear().toString();
	$scope.month = CalendarService.formatMonthToString(date.getMonth());

	DataService.getYearMonthList().success(function(data){
		$scope.yearList = data.years;
		$scope.monthList = data.months;
	});
	
	$scope.refreshCalendar = function(){
		yearMonthKey = $scope.year + '_' + $scope.month;
		$scope.calendarStarted = false;
	
		//var savedEvents = JSON.parse(localStorage.getItem(yearMonthKey));

		//if(isEmpty(savedEvents)){
			DataService.getEventList().success(function(data){
				savedEvents = CalendarService.reorganizeEvent($scope.year, $scope.month, data.events);

				$scope.events = savedEvents;
				//localStorage.setItem(yearMonthKey, JSON.stringify(savedEvents));
			});
		//} else {
		//	$scope.events = CalendarService.reorganizeEvent($scope.year, $scope.month, savedEvents);
		//}
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


	$scope.showDetail = function(eventDayObj) {
        ModalService.showModal({
            templateUrl: 'calenderDetailModal.html',
            controller: "ModalController",
			inputs: {
				eventDayObj: eventDayObj,
				toastr: toastr,
				yearMonthKey: yearMonthKey
			},
			scope: $scope
        }).then(function(modal) {
			
            modal.element.modal({backdrop: 'static'});
			
            modal.close.then(function(eventDayObj) {
				angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
            });
        });
    };

	
	$scope.formatDate = function(timestamp){
		return CalendarService.formatDate(timestamp);
	}

	//expose the function outside
	$scope.isEmpty = function(obj){
		return isEmpty(obj)
	}

	//this is a very strict function to determine if an obj is a "empty" object
	function isEmpty(obj){
		return (typeof obj == 'undefined' || obj == null
			|| JSON.stringify(obj) === JSON.stringify({}) || obj.length <= 0);
	}
}]);

CalendarApp.controller('ModalController', function($scope, eventDayObj, close, toastr, yearMonthKey) {
	//For Current Event, we must push the elements one by one again so that the array does not pass by reference
	$scope.currentEvents = [];
	angular.forEach(eventDayObj.events, function(event){
		var newEvent = new Event();
		newEvent.processJSON(event);
		$scope.currentEvents.push(newEvent);
	})

	$scope.eventDayObj = eventDayObj;

	$scope.close = function() {
		close(eventDayObj);
	};

	$scope.addNewEvent = function(){
		$scope.currentEvents.push(new Event());
	}

	$scope.updateEventDayObj = function(){
		var allEventsValid = true;

		angular.forEach($scope.currentEvents, function(event){
			if(allEventsValid && !event.validate()){
				allEventsValid = false;
			}
		});

		if(allEventsValid){
			eventDayObj.events = $scope.currentEvents;

			//save to localStorage
			//localStorage.setItem(yearMonthKey, JSON.stringify($scope.events));

			toastr.success('Events updated!');
			close(eventDayObj);
		}
	}

	$scope.removeEvent = function(index){
		$scope.currentEvents.splice(index, 1);
	}

	//TODO: toast, after save, modal scroll
});
