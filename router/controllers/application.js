
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
    // onRun is only called once, so buttons are not reactive (right now) 
    this.updateButtons(function(buttons) {
      return buttons.concat(this.buttons);    
    });
  },

  onBeforeAction: function() {
    // before actions get run reactively, so the title can be rendered dynamically 
    this.updateTitle(this.title); 

    this.next();   
  },

  onStop: function() {
    // clean up controller's custom header content
    var buttonsCount = this.buttons ? this.buttons.count : 0;
    this.updateButtons(function(buttons) {
      return buttons.slice(buttons.count - buttonsCount); 
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

