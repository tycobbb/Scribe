
Fixtures.group(function(group) { 
  
  // 
  // Configuration
  group.collection = Stories;
  group.depend(Meteor.users);
  
  //
  // Fixtures 
  group.run(function(fixtures) {
    
    // group all users into categories 
    var users = groupUsers(Meteor.users.find().fetch());
  
    //
    // Public stories 
    fixtures.insert({

      defaults: {
        isPrivate: false
        allowAnonymous: true 
      },

      records: [{
        title: "Ender's Game",
        description: "A tale about a boy who wasn't much of a boy at all.",
      },{
        title: "Infinite Jest",
        description: "A tale about a boy who couldn't open up.",
      },{
        title: "Barbie's Horse Adventure",
        description: "This is a video game yo.",
      }],
      
      map: function(record) {
        // add a random number of particiapnts from the mixed users
        record.participantCount = _.random(2, users.mixed.length);
        
        // get the ids of the random users 
        record.participantIds = _.chain(users.mixed)
          .sample(record.participantCount)
          .pluck("_id").value();

        return record;
      }

    });
    
    //
    // Private stories -- only visible to certain authed users
    var participantIds =_.chain(users.authenticated)
      .first(2)
      .pluck("_id").value();

    fixtures.insert({

      defaults: {
        isPrivate: true,
        participantIds: participantIds,
        participantCount: participantIds.length
      },
      
      records: [{
        title: 'Tykub\'s Excellent Adventure',
        description: 'Two dudes, Mario Tennis, the rally of a lifetime.'
      }]   

    });

  });

  //
  // Helpers
  function groupUsers(users) {
    // partiton all users into [[anon],[auth]]
    var anonymous = _.filter(users, function(user) {
      return user.profile.anonymous;    
    });
 
    return {
      // namespace anonymous users
      anonymous: anonymous,
      // namespace authenticated users
      authenticated: _.difference(users, anonymous),
      // pull some mixed users
      mixed: _.shuffle(users)
    };  
  }
    
});

