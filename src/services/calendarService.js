CalendarApp.service('CalendarService', function($http) {
	this.reorganizeEvent = function(year, month, events){
		var monthStart = getFirstDateOfMonth(year, month).getTime();
		var startTimestamp = monthStart;

		//if the 1st day is not SUN, revert until sun to hit the 1st of the calendar
		while(new Date(parseInt(startTimestamp)).getDay() != DAY_OF_WEEK_SUN){
			startTimestamp -= MILLISECONDS_PER_DAY;
		}
		
		var monthEnd = getLastDateOfMonth(year, month).getTime();
		var endTimestamp = monthEnd;
		
		//same way for ending: if the last day is not SAT, push it to SAT
		while(new Date(parseInt(endTimestamp)).getDay() != DAY_OF_WEEK_SAT){
			endTimestamp += MILLISECONDS_PER_DAY;
		}
	
		//after initiate, all the dailyEventObjs are objs with timestamp and empty event list
		var dailyEventObjs = initTimestampObjs(startTimestamp, endTimestamp, monthStart, monthEnd);
		angular.forEach(events, function(event){
			var eventObj = new Event();
			eventObj.processJSON(event);

			var eventTimestamp = parseDate(event.date).getTime();
			if(eventTimestamp >= startTimestamp && eventTimestamp <= endTimestamp){
				dailyEventObjs[eventTimestamp].events.push(eventObj);
			}
		});
		
		//until here, each dailyEventObjs will have a list of events
		var monthlyEventObjs = [];
		var rowIndex = 0;
		var dayIndex = 0;
		angular.forEach(dailyEventObjs, function(dayEventObj){
			if(typeof monthlyEventObjs[rowIndex] == 'undefined'){
				monthlyEventObjs[rowIndex] = [];
			}
			
			monthlyEventObjs[rowIndex].push(dayEventObj);
			dayIndex += 1;
			if(dayIndex > 0 && dayIndex%7==0){
				rowIndex += 1;
			}
		});
		
		return monthlyEventObjs;
	}
	
	this.processEventJSON = function(monthlyEventJson){

		angular.forEach(monthlyEventJson, function(weeklyEventJson, rowIndex){
			var weeklyEventObj = [];

			angular.forEach(weeklyEventJson, function(dailyEventJson){
				var events = [];

				angular.forEach(dailyEventJson.events, function(eventJson){
					var event = new Event();
					event.processJSON(eventJson);
					events.push(event);
				});

				dailyEventJson.events = events;
			});

		});

		return monthlyEventJson;
	}

	this.formatMonthToString = function(month){
		return formatToTwoDigits(month+1);
	}
	
	this.formatToTwoDigits = function(num){
		return formatToTwoDigits(num);
	}
	
	this.parseDate = function(date){
		return parseDate(date);
	}
	
	this.getColumns = function(){
		return {
			DAY_OF_WEEK_SUN: "Sunday",
			DAY_OF_WEEK_MON: "Monday",
			DAY_OF_WEEK_TUE: "Tuesday",
			DAY_OF_WEEK_WED: "Wednesday",
			DAY_OF_WEEK_THU: "Thursday",
			DAY_OF_WEEK_FRI: "Friday",
			DAY_OF_WEEK_SAT: "Saturday"
		}
	}
	
	this.getShortMonthText = function(month){
		var months = {
			'01':'Jan',
			'02':'Feb',
			'03':'Mar',
			'04':'Apr',
			'05':'May',
			'06':'Jun',
			'07':'July',
			'08':'Aug',
			'09':'Sep',
			'10':'Oct',
			'11':'Nov',
			'12':'Dec',
		};
		
		return months[month];
	}

	//date format to be 'yyyy-dd-mm'
	this.formatDate = function(timestamp){
		var date = new Date(parseInt(timestamp));

		return date.getFullYear() + '-' + this.formatToTwoDigits(date.getMonth()+1) + '-' + this.formatToTwoDigits(date.getDate());
	}
	
	//in scope functions
	function formatToTwoDigits(num){
		var numText = num.toString();
	
		if(num < 10){
			numText = '0' + numText;
		}
		
		return numText;
	}
	
	function initTimestampObjs(startTimestamp, endingTimestamp, monthStart, monthEnd){
		var runningTimestamp = startTimestamp;
		
		var timestampObjs = {};

		while(runningTimestamp <= endingTimestamp){
			timestampObjs[runningTimestamp] = {timestamp: runningTimestamp, events: [], valid: true};
			if(monthStart > runningTimestamp || monthEnd < runningTimestamp){
				timestampObjs[runningTimestamp].valid = false;
			}
			
			runningTimestamp += MILLISECONDS_PER_DAY;
		}
		
		return timestampObjs;
	}
	
	function getLastDateOfMonth(year, month){
		return new Date(year, month, 0);
	}
	
	function getFirstDateOfMonth(year, month){
		return new Date(year + '-' + month + '-01 00:00:00');
	}
	
	function parseDate(dateString){
		//format yyyy-MM-dd
		//always set to '00:00:00'
		return new Date(dateString + ' 00:00:00');
	}
})