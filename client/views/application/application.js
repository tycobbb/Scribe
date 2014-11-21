
Template.header.helpers({
  
  title: function() {
    return Session.get('title');
  },
  
  buttons: function() {
    return []; // Session.get('header-buttons');
  },

});

