var planingService = new PlaningService();

var calendar = $('#calendar').fullCalendar(planingService.getFullCalendarConfiguration());

var sessions = new Sessions(); 

sessions.fetch({
    reset: true,                
    success: function(){
        sessions.each(function(session,key) {
		  	session.set('id', key);
		  	planingService.loadSessionView(session);
		});
		planningEvent.trigger("loadDone");
    },
    error: function(){
        alert('Loading sessions failed');
    }
});


var planningEvent = {};

_.extend(planningEvent, Backbone.Events);


planningEvent.on("loadDone", function() {
  	$('div.profile button').on('click', function(){
  		var btn = $(this);
  		var idSession = btn.attr('session');
  		var color = '#26FF00';
  		if (btn.hasClass('btn-primary')) {
  			planningEvent.trigger("updateColorEvent", idSession, color, 'eventToprint');	
  			planningEvent.trigger("updateButton", btn, 'remove');	
  		} else {
  			planningEvent.trigger("updateButton", btn, 'add');
  			planningEvent.trigger("updateColorEvent", idSession, '');	
  		}
  		
  	});

    // Impression de évènements
    $('.print').on('click', function(){
      // Pour chaques évènements
      // _.each(calendar.fullCalendar('clientEvents'), function(oneEvent){
      //   console.log(oneEvent);
      // });
      window.print();
    });
});

planningEvent.on("updateColorEvent", function(idSession, color = '', className = 'defaultEvent') {
	var sessionEvent = calendar.fullCalendar( 'clientEvents', idSession)[0];
	sessionEvent.backgroundColor = color;
  sessionEvent.className = className;
	calendar.fullCalendar('updateEvent', sessionEvent);
});

planningEvent.on('updateButton', function(btn, state) {
	var addClass = 'btn-primary';
	var removeClass = 'btn-danger';
	var text = 'Je participe !';

	if(state != 'add') {
		var tmpClass = addClass;
		addClass = removeClass;
		removeClass = tmpClass;
		text = 'Je ne participe plus.';
	}

	btn.removeClass(removeClass);
	btn.addClass(addClass);
	btn.html(text);
});



