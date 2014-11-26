
Fixtures.group(function() { 
  
  // 
  // Configuration
  this.collection = Stories;
  this.depend(Meteor.users);
  
  //
  // Fixtures 
  this.run(function() {
    
    // find all the users, to assosciate them with the stories
    var users = Meteor.users.find().fetch();
    
    // add the stories  
    this.add({
      defaults: {
        participantIds: _.pluck(users, "_id")
      },

      records: [{
        title: "Ender's Game",
        description: "A tale about a boy who wasn't much of a boy at all.",
      },{
        title: "Infinite Jest",
        description: "A tale about a boy who couldn't open up."
      },{
        title: "Barbie's Horse Adventure",
        description: "This is a video game yo." 
      }]
    });

  });
    
});

