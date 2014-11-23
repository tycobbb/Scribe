
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
    
    // clean up our subscriptions 
    self.unsubscribe();
  },

  //
  // Subscriptions
  //

  subscriptions: [],
  
  // subscribes to the publication for the given name 
  subscribe: function(name, options) {
    if(!name) {
      throw new Exeception('cannot create a subscription without a name');
    }
  
    // subscribe to the publication with the parameterized name 
    var handle = Meteor.subscribe(hame);
    
    // create the object we'll use to track the subscription
    var subscription = _.defaults({
      handle: handle
    }, options);

    this.subscriptions.push(subscription);

    return subscription;
  },
  
  // unsubscribes from _all_ active subscriptions
  unsubscribe: function() {
    // stop any subscriptions (we can filter certain subscriptions out, not stopping
    // them, later if we deem it necessary). 
    this.subscriptions.forEach(function(subscription) {
      subscription.handle.stop();
    });
    
    // but for now, we're throwing them all away 
    this.subscriptions = null; 
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

