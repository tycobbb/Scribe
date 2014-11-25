
Meteor.startup(function() {
  
  //
  // Anonymous Users
  // 

  Meteor.users.fixtures({ 
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
  
});

