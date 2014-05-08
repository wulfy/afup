function PlaningService() {
    this.dateTimeFormat = 'DD/MM/YYYY HH:mm';

    this.makeEvent = function(session) {
    	var newEvent = new Object();

    	var time = session.get('timeSlot').split(' - ');
    	var eventDateStart = moment(session.get('dateSlot') + ' ' + time[0], this.dateTimeFormat);
    	var eventDateEnd = moment(session.get('dateSlot') + ' ' + time[1], this.dateTimeFormat);
    	
		newEvent.title = session.get('title');
		newEvent.start = eventDateStart.toDate();
		newEvent.end = eventDateEnd.toDate();
		newEvent.allDay = false;

		return newEvent
    };

    this.getFullCalendarConfiguration =  function() {
    	var config = new Object({
			header: {
				left: '',
				center: '',
				right: ''
			},
			year: 2014,
			month: 5,
			date: 23,
			defaultView: "agendaWeek",
			weekends:false,
			hiddenDays: [ 3, 4, 5 ],
			editable: false,
			allDaySlot:false,
			slotMinutes:15,
			firstHour:9,
			minTime:9,
			maxTime:18,
			h: 2500,
			timeFormat: 'H(:mm)',
			columnFormat: {
				week: 'dddd dd MMMM'
			},
			axisFormat: 'HH:mm',
			dayNames: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
			dayNamesShort: ['Lun','Mar','Mer','Jeu','Thu','Ven','Sam','Dim'],
			monthNames : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
		});

		return config;
    };

    this.loadSessionView = function(session) {
    	var sessionView = new SessionView();
	  	sessionView.model =  session;
	  	$('div.session').append(sessionView.render());

	  	calendar.fullCalendar( 'renderEvent', this.makeEvent(session),'stick');
    }
};