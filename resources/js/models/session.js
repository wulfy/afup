var Session = Backbone.Model.extend({
    initialize: function() {
        //console.log(JSON.stringify(this));
        this.on('change:view', function() {
            console.log('Change view');
        })
    },
 
    defaults: {
        id: '',
        title: '',
        dateSlot: '',
        timeSlot: '',
        speaker1: '',
        speaker1Id: '',
		speaker2: '',
        speaker2Id: '',
        dtls: '',
        language : "FR",
        space: '',
        view: false
    }
});