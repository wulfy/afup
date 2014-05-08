var planingService = new PlaningService();

var calendar = $('#calendar').fullCalendar(planingService.getFullCalendarConfiguration());

var sessions = new Sessions(); 

sessions.fetch({
    reset: true,                
    success: function(){
        sessions.each(function(session) {
		  	planingService.loadSessionView(session);
		});
    },
    error: function(){
        alert('Loading sessions failed');
    }
});


