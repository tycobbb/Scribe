
StoryController = ApplicationController.extend({

  waitOn: function() {
    return Meteor.subscribe('story-one', this.params._id);
  },

  data: function() {
    // fetch the story
    var story = Stories.findOne({ 
      _id: this.params._id 
    });

    // TODO: this might not be the best place to update the title, it'd be nice
    // to do it in a lifecycle hook where we have access to the fetched story
    if(story) { 
      this.title = story.title;
    }

    return story;
  }

});

