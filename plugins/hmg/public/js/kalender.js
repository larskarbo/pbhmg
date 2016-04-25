/**

This module handles calendar creation and interaction

Depends on fullcalendar and moment

**/


window.kalender=(function(){
	//private

	function dayClick(date, jsEvent){


		var calendar = $(this).closest('.fc-scheduler');
		var allEvents = calendar.fullCalendar('clientEvents');

		if(! ($(this).hasClass('fc-future') && !$(this).hasClass('fc-other-month')) && !$(this).hasClass('fc-today')) {
			console.log('not allowed')
			return
		}

		var event = false;
		$.grep(allEvents, function(value){
			if(value.start.isSame(date)){
				event = value;
			}
		})

		var formContent = '<div class="group">';
		formContent += '<p>Skriv en kort tittel på <span class="textile fc-event-alike">arrangement</span></p>';
		formContent += '</div>';
		formContent += '<div class="form-group"><input name="input" autofocus></div>';
		prompt.start({
			title: date.format('Do MMMM'),
			submitButton: 'Legg til',
			formContent: formContent
		}, function(result){
			if(result){
				console.log(result)
				if(result[0].value.length > 0){
					console.log('etnh')
					addTrip(result[0].value, date, calendar)
				}else{
					return
				}
			}
		});


	}

	function eventClick(calEvent, jsEvent){
		var calendar = $(this).closest('.fc-scheduler');

		prompt.start({
			title: 'Vil du slette "' + calEvent.title + '"? (' + calEvent.start.format('Do MMMM') + ')',
			submitButton: 'Slett'
		}, function(result){
			if(result){

				remove(calEvent, calendar, function(){
					console.log('removed')
				});
			}
		});
	}


	function addTrip(text, date, calendar){
		var event = {
			title: text,
			allday: true,
			start: date,
			className: 'trip'
		}

		add(event, function(err, dbEvent){
			if(err) throw err;
			console.log(dbToLocal(dbEvent));
			calendar.fullCalendar('renderEvent', dbToLocal(dbEvent));
		});
	}

	function add(event, callback){
		dbEvent = {
			title: event.title,
			date: event.start.format("YYYY-MM-DD"),
			type: event.className
		}

		$.post('/admin/kalender/addEvent', {event: dbEvent})
		.success(function(response){
			callback(null, response);
		})
		.fail(function(err){
			console.log('error');
			callback('error')
		})
	}

	function remove(event, calendar, callback){
		calendar.fullCalendar('removeEvents', event.id);
		$.post('/admin/kalender/removeEvent', {eventId: event.id})
		.success(function(response){
			console.log(response);
			callback(null, response);
		})
		.fail(function(response){
			console.warn('err', response)
			callback(response)
		})
	}

	function getEvents(start, end, timezone, callback){

		$.post('/admin/kalender/getEvents', {
			start: start.format("YYYY-MM-DD"),
			end: end.format("YYYY-MM-DD")
		})
		.success(function(response){
			response.forEach(dbToLocal);
			console.log('after', response)
			callback(response);
		})
		.fail(function(response){
			console.log(response)
		})

	}

	function dbToLocal(element, index){
		element.id = element._id;
		element.className = [element.type,'show-all-text-event'];
		element.start = element.date
		element.allDay = true;

		if(element.type == "busy"){
			element.rendering = 'background'
		}
		return element
	}


	//public:
	return{
		init:function(element){
			var options = {
				lang: 'nb',
				fixedWeekCount: false,
				titleFormat: "MMMM",
				weekNumbers: true,
				height: 'auto',
				dayClick: dayClick,
				eventClick: eventClick,
				events: getEvents
			}

			var calendarDiv = '<div class="fc-scheduler edit"></div>';
			var cal = $(calendarDiv).appendTo(element).fullCalendar(options);

			cal.fullCalendar( 'gotoDate', moment() );

		}
	}

}());

kalender.init($('#kalender'));
