
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

});

