
CalendarApp.controller("CalendarContorller", ['$uibModal','toastr','$scope', '$http', '$document', 'DataService', 'CalendarService',
	function ($uibModal, toastr, $scope, $http, $document, DataService, CalendarService) {
	//Init
	var $ctrl = this;
	$ctrl.animationsEnabled = true;

	$ctrl.yearList = [];
	$ctrl.monthList = [];
	$ctrl.events = [];
	
	$ctrl.runningDateTimestamp = 0;
	$ctrl.calendarRows = 0;
	$ctrl.firstDayOfWeekForEvents = 0;
	$ctrl.calendarColumns = CalendarService.getColumns();
	$ctrl.calendarStarted = false;
	
	var yearMonthKey = '';

	var date = new Date();
	$ctrl.year = date.getFullYear().toString();
	$ctrl.month = CalendarService.formatMonthToString(date.getMonth());

	DataService.getYearMonthList().success(function(data){
		$ctrl.yearList = data.years;
		$ctrl.monthList = data.months;
	});
	
	$ctrl.refreshCalendar = function(){
		yearMonthKey = $ctrl.year + '_' + $ctrl.month;
		$ctrl.calendarStarted = false;
	
		var savedEvents = localStorage.getItem(yearMonthKey);
		
		if(isEmpty(savedEvents)){
			DataService.getEventList().success(function(data){
				//TODO: to loop the events one more time seem not so effective, let see what i could do
				$ctrl.events = CalendarService.reorganizeEvent($ctrl.year, $ctrl.month, data.events);
				localStorage.setItem(yearMonthKey, JSON.stringify($ctrl.events));
			});
		} else {
			savedEvents = JSON.parse(savedEvents);
			$ctrl.events =  CalendarService.processEventJSON(savedEvents); 
		}
	};
	$ctrl.refreshCalendar();

	$ctrl.isValidDay = function(dayOfWeek, timestamp){
		//if calendar started, valid
		if($ctrl.calendarStarted){
			return typeof ($ctrl.events[timestamp] != 'undefined');
		}
		//else, only the first day of week of the running timestamp will trigger the start
		if(new Date(parseInt(timestamp)).getDay() == dayOfWeek){
			$ctrl.calendarStarted = true;
			
			return (typeof $ctrl.events[timestamp] != 'undefined');
		} else {
			return false;
		}
	}
	
	$ctrl.printDay = function(timestamp){
		return CalendarService.formatToTwoDigits(new Date(parseInt(timestamp)).getDate());
	}
	
	$ctrl.onParamChange = function(){
		$ctrl.refreshCalendar();
	}
	
	$ctrl.getMonthDisplay = function(month){
		return CalendarService.getShortMonthText(month);
	}



  $ctrl.showDetail = function (dailyEventObj) {

    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaDescribedBy: 'modal-body',
      templateUrl: 'calenderDetailModal.html',
      controller: 'ModalController',
      controllerAs: '$ctrl',
	  	size: 'lg',
      resolve: {
        dailyEventObj: function () {
          return dailyEventObj;
        },
				yearMonthKey: function () {
          return yearMonthKey;
        }
      }
    });

		//when the modal signals process done: give the user a success toast 
    modalInstance.result.then(function (returnedDailyEventObj) {
			
			//save to localStorage
			localStorage.setItem(yearMonthKey, JSON.stringify($ctrl.events));
			toastr.success('Events updated!');
    });
  };
	
	$ctrl.formatDate = function(timestamp){
		return CalendarService.formatDate(timestamp);
	}

	//expose the function outside
	$ctrl.isEmpty = function(obj){
		return isEmpty(obj)
	}

	//this is a very strict function to determine if an obj is a "empty" object
	function isEmpty(obj){
		return (typeof obj == 'undefined' || obj == 'undefined' || obj == null
			|| JSON.stringify(obj) === JSON.stringify({}) || obj.length <= 0);
	}
}]);


