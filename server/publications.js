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
  
  var self = this,
      Users = Meteor.users,
      handles = {};
  
  function observeUsers(participantIds) {
    // tear down any existing observation on users
    if(handles.users) {
      handles.users.stop();   
    }
    
    // do nothing if we have no users to observe
    if(!participantIds) {
      return;   
    }
    
    // observe the users and add them as they come in
    handles.users = Users.find({
      _id: { $in: participantIds }
    }).observe({
      added: function(doc) {
        self.added(Users._name, doc._id, doc);
      },
      removed: function(doc) {
        self.removed(Users._name, doc._id);
      }  
    });
  }
  
  // observe the story and rebuild the user handle as it changes
  handles.story = Stories.find({
    _id: storyId
  }).observeChanges({
    // if the story is added, observe its users
    added: function(id, doc) {
      observeUsers(doc);
    },
    // if participantIds changes, re-observe the users
    changed: function(id, fields) {
      if(_.has(fields, 'participantIds')) {
        observeUsers(fields); 
      }
    },
    // if the story is removed, stop the publication
    removed: function() {
      self.stop();  
    }
  });

  self.onStop(function() {
    // stop all our observations 
    _.chain(handles).values().each(function(handle) {
      handle.stop();
    });
  });

});

