
Meteor.publish('stories-active', function() {
  return Stories.active();  
});

Meteor.publish('stories-participating', function() {
  return Stories.participating(); 
});

