var Sessions = Backbone.Collection.extend({
  defaults: {
        model: Session
  },
  model : Session,
  url: 'resources/data/sessions.json'
});