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
      stories: Stories.find()
    });
  },
  
  memberStories: function() {
    return new Bucket({
      title: 'Your Stories',
      stories: Stories.find() 
    });  
  }

});

