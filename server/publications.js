
Meteor.publish('stories-active', function() {
  return Stories.active();  
});

Meteor.publish('stories-participating', function() {
  return Stories.participating(); 
});

Meteor.publish('story-detail', function(storyId) {
  check(storyId, String);
  return Stories.find({
    _id: storyId
  });
});

