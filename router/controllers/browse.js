
BrowseController = ApplicationController.extend({

  title: 'Browse',
  buttons: [ 'createStoryButton' ],

  waitOn: function() {
    return [
      Meteor.subscribe('stories-active'),
      Meteor.subscribe('stories-participating')
    ];
  }
 
});

