//
// Bucket
//

function Bucket(options) {
  this.name = options.name;
  this.stories = options.stories;  
}

//
// Browse 
//

Template.browse.helpers({ 

  activeStories: function() {
    return new Bucket({
      name: 'Active Stories',
      stories: Stories.find()
    });
  },
  
  memberStories: function() {
    return new Bucket({
      name: 'Your Stories',
      stories: Stories.find() 
    });  
  }
});

