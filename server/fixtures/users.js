
Fixtures.group(function() {
 
  //
  // Configuration 
  this.collection = Meteor.users; 
  
  //
  // Anonymous users
  this.add({
    defaults: {
      profile: {
        anonymous: 'anonymous'  
      } 
    },

    records: [{
      username: 'billy'
    },{
      username: 'michelle'
    },{
      username: 'jefferson'   
    },{
      username: 'falcomaster99'   
    }] 
  });

  //
  // Authenticated users
  this.add({ 
    records: _.map([{
      name: 'John Kimball',
      email: 'john@kimball.com' 
    },{
      name: 'Ty Cobb',    
      email: 'ty@cobb.com'
    },{
      name: 'Jakub Misterka',   
      email: 'kuba@mister.ka' 
    }], function(user) {
      return {
        profile: {
          name: user.name,   
        },
        emails: [{
          address: user.email   
        }]   
      };
    })
  });

});

