//
// Collection
//

Stories = new Mongo.Collection('stories');

//
// Queries
//

// returns the active stories for the browse screen
// TODO: maybe this should also include private stories that the user is part of?
Stories.findActive = function(userId) {
  var options  = {};
  options.sort = {
    participantCount: -1
  };

  var query = {};
  query.isPrivate = false;

  if(Meteor.users.isAnonymous(userId)) {
    query.allowAnonymous = true;
  }

  return Stories.find(query, options);
};

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
    // TODO: validate this better 
    check(story, Object);

    if(!this.userId) {
      throw new Meteor.Error('not-authenticated', 'Must be signed-in to create a story.');
    }
    
    // prepare the ids in advance so we can sync our models properly
    var storyId = new Mongo.ObjectID()._str;

    // update the story's id
    story._id = storyId;
    
    // update this user as the story's author 
    story.authorId = this.userId;

    // add the author as a participant as well 
    story.participantIds = _.chain([ this.userId ])
      .union(story.participantIds)
      .compact().value(); 

    story.participantCount = story.participantIds.length;
    
    // if we have a story body, we want to convert it to a Line
    if(story.body) { 
      // TODO: we might need to do some error handling here
      var lineId = Lines.insert({
        text: story.body,
        storyId: storyId
      });
      
      // update the with this line
      story.lineIds = [ lineId ]; 
      story.body = null;
    }

    // insert the story
    Stories.insert(story);  
    
    // return the story in case further customization is needed
    return story;
  }

});

//
// Model 
//

Story = Model.extend(Stories);

// add relationships
Story.toMany('Meteor.users', 'participants');
Story.toMany('lines');

