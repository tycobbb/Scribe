
ApplicationController = RouteController.extend({

 	layoutTemplate: 'application',
	notFoundTemplate: 'notFound',

  onBeforeAction: function() {
    Session.set('title', this.title);
    this.next();   
  }

});

