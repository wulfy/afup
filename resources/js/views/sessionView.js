var SessionView = Backbone.View.extend({
    tagName: 'div',
    template: $("#sessionTemplate").html(),
    className: 'well profile',
    model: null,
    render: function() {
        var rendered_content = Mustache.to_html(this.template, this.model.toJSON());
        this.$el.html(rendered_content);
       	return $(this.el);
    }
});