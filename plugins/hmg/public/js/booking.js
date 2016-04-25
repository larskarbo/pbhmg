/**

This module handles calendar creation and interaction

Depends on fullcalendar

**/


window.kalender=(function(){
	//private
	var textarea = $('textarea');

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

		if(event)
			return;

		textarea.val(textarea.val() + date.format('dddd DD. MMMM YYYY') + '\n');
		textarea.focus();
		window.scrollTo(0, textarea.offset().top);

		
	}

	function getEvents(start, end, timezone, callback){

		$.post('/kalender/getEvents', {
			start: start.format("YYYY-MM-DD"),
			end: end.format("YYYY-MM-DD")
		})
		.success(function(response){
			response.forEach(dbToLocal);
			console.log('after', response)
			callback(response);
		})
		.fail(function(response){
			console.log(returnsponse)
		})

	}

	function dbToLocal(element, index){
		element.id = element._id;
		element.className = element.type;
		element.start = element.date

		if(element.type == "busy"){
			element.allDay = true;
			element.rendering = 'background'
		}
		
		return element
	}


	//public:
	return{
		init:function(element){
			var options = {
				lang: 'nb',
				header: {
					left:   'title',
					center: '',
					right:  ''
				},
				fixedWeekCount: false,
				titleFormat: "MMMM",
				weekNumbers: true,
				height: 'auto',
				events: getEvents,
				dayClick: dayClick
			}
			var calendarDiv = '<div class="fc-scheduler"></div>';
			var cal1 = $(calendarDiv).appendTo(element).fullCalendar(options);
			var cal2 = $(calendarDiv).appendTo(element).fullCalendar(options);
			var cal3 = $(calendarDiv).appendTo(element).fullCalendar(options);

			var firstCal = moment().date("2013-09-08").add(1, 'months');

			console.log(firstCal.isValid())

			cal1.fullCalendar( 'gotoDate', moment() );

			cal2.fullCalendar( 'gotoDate', moment().add(1, 'months') );

			cal3.fullCalendar( 'gotoDate', moment().add(2, 'months') );


		}
	}

}());

kalender.init($('#kalender'));

contact.init($('#skjema'));