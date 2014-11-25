//
// Collection
//

Stories = new Mongo.Collection('stories');

Stories.active = function() {
  return Stories.find({});
};

Stories.participating = function() {
  return Stories.find({});
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
    story.participantIds = [ this.userId ];
    
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

