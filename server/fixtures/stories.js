
Fixtures.group(function() { 
  
  // 
  // Configuration
  this.collection = Stories;
  this.depend(Meteor.users);
  
  //
  // Fixtures 
  this.run(function() {
    
    // group all users into categories 
    var users = groupUsers(Meteor.users.find().fetch());
   
    // add public stories 
    this.add({
      defaults: {
        // public stories should be visible to the mixed user-set
        participantIds: _.pluck(users.mixed, "_id")
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

    // add private stories
    this.add({
      defaults: {
        isPrivate: true,
        // private stories should only be visible to certain authed users
        participantIds: _.chain(users.authenticated)
          .first(2).pluck("_id").value()
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
    // note: this was all much more elegant when i was using _.partition, but
    // meteor's using a modified version of underscore 1.5.2... :/

    // partiton all users into [[anon],[auth]]
    var anonymous = _.filter(users, function(user) {
      return user.profile.anonymous;    
    });
 
    var groups = {
      // namespace anonymous users
      anonymous: anonymous,
      // namespace authenticated users
      authenticated: _.difference(users, anonymous)
    };
    
    // sample 2 items from each group and join them
    function concat(memo, group) { 
      return memo.concat(_.sample(group, 2));
    }

    groups.mixed = _.chain(groups).values()
      .reduce(concat, [])
      .shuffle()
      .value();

    return groups;
  }
    
});

