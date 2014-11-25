//
// Browse
//

Meteor.publish('stories-active', function() {
  return Stories.active();  
});

Meteor.publish('stories-participating', function() {
  return Stories.participating(); 
});

//
// Story
//

Meteor.publish('story-detail', function(storyId) {
  check(storyId, String);
  return Stories.find({
    _id: storyId
  });
});

Meteor.publish('story-users', function(storyId) {
  check(storyId, String); 
  // find the story
  var story = Stories.findOne({ _id: storyId });
  // get all its participating users 
  return Users.find({
    _id: { $in: story.participantIds } 
  });
});

//
// Dyanmic User Search
//

Meteor.publish("searchUsers", getSearchUsers);
