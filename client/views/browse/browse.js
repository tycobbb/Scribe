//
// Bucket
//

function Bucket(options) {
  _.extend(this, options);
}

//
// Browse 
//

Template.browse.helpers({ 

  activeStories: function() {
    return new Bucket({
      title: 'Active Stories',
      stories: Stories.findActive(Meteor.userId())
    });
  },
  
  participatingStories: function() {
    return new Bucket({
      title: 'Your Stories',
      stories: Stories.findByParticipantId(Meteor.userId()) 
    });  
  }

});

Template.storyCard.helpers({
  
  participantCount: function() {
    return this.participantCount + ' users';
  }
      
});

