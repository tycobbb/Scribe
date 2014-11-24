
ApplicationController = RouteController.extend({
  
  //
  // Templates
  // 
   
 	layoutTemplate: 'application',
	notFoundTemplate: 'notFound',

  //
  // Lifecycle 
  //

  onRun: function() {
    var self = this;

    // onRun is only called once, so buttons are not reactive (right now) 
    self.updateButtons(function(buttons) {
      return buttons.concat(self.buttons);    
    });

    this.next();
  },

  onBeforeAction: function() {
    // before actions get run reactively, so the title can be rendered dynamically 
    this.updateTitle(this.title); 

    this.next();   
  },

  onStop: function() {
    var self = this;

    // clean up controller's custom header content
    self.updateButtons(function(buttons) {
      var buttonCount = self.buttons ? self.buttons.length : 0;
      return buttons.slice(0, buttons.length - buttonCount); 
    });  
  },

  //
  // Header Reactivity
  //
  
  // updates the header title using the parameterized string
  updateTitle: function(title) {
     Session.set('title', title);
  },
  
  // updates the header buttons using a closure of the form:
  //   (buttons) -> buttons
  updateButtons: function(transformer) {
     var buttons = Session.get('header-buttons') || [];
     buttons = transformer(buttons);
     Session.set('header-buttons', buttons);
  }

});

