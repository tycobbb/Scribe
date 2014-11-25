
StoryController = ApplicationController.extend({

  subscriptions: function() {
    // block on the story detail
    this.subscribe('story-detail', this.params._id).wait();  
  },

  data: function() {
    // fetch the story
    var story = Stories.findOne({ 
      _id: this.params._id 
    });

    // TODO: this might not be the best place to update the title, it'd be nice
    // to do it in a lifecycle hook where we have access to the fetched story
    this.title = story ? story.title : '';

    return story;
  }

});

