
Fixtures.group(function(group) {
 
  //
  // Configuration 
  group.collection = Meteor.users; 

  group.run(function(fixtures) {   
  
    //
    // Anonymous users
    fixtures.insert({

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
    fixtures.insert({ 

      records: [{ 
        name: 'Jakub Misterka',   
        email: 'kuba@mister.ka'  
      },{
        name: 'Ty Cobb',    
        email: 'ty@cobb.com'
      },{
        name: 'John Kimball',
        email: 'john@kimball.com' 
      }],
      
      map: function(user) {
        return {
          username: user.name,
          profile: {
            name: user.name,   
          },
          emails: [{
            address: user.email   
          }]   
        };
      }

    });

  });

});

