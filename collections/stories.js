//
// Collection
//

Stories = new Mongo.Collection('stories');

//
// returns the active stories for the browse screen
// TODO: maybe this should also include private stories that the user is part of?
Stories.findActive = function(userId) {
  var options  = {};
  options.sort = {
    participantCount: -1
  };
      
  return Stories.find({ 
    isPrivate: false 
  }, options);
};

//
// returns the stories the user with the given id is part of
Stories.findByParticipantId = function(userId) {
  return Stories.find({
    participantIds: userId 
  });
};

//
// Methods
//

Meteor.methods({
  
  createStory: function(story) {
    check(story, Object);

    if(!this.userId) {
      throw new Meteor.Error('not-authenticated', 'Must be signed-in to create a story.');
    }
    
    // update this user as the story's author 
    story.authorId = this.userId;
    story.participantIds = _.chain([ this.userId ])
      .union(story.participantIds)
      .compact().value();
    
    // track the number of participants 
    story.participantCount = story.participantIds;
    
    // we'll need update the story based on the users permissions
    var storyId = Stories.insert(story); 
    story._id = storyId;

    return story;
  },

});

//
// Model 
//

Story = Model.extend(Stories);

// add relationships
Story.toMany('Meteor.users', 'participants');

