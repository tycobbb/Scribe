
BrowseController = ApplicationController.extend({

  title: 'Browse',
  buttons: [ 'createStoryButton' ],
 
  onRun: function() {
    this.subscribe('stories-active');
    this.subscribe('stories-participating');
  }
 
});

