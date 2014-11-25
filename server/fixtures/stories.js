
Meteor.startup(function() { 

  Stories.fixtures({ 
    defaults: {
      isGreat: true
    },

    records: [{
      title: "Ender's Game",
      description: "A tale about a boy who wasn't much of a boy at all." 
    },{
      title: "Infinite Jest",
      description: "A tale about a boy who couldn't open up."
    },{
      title: "Barbie's Horse Adventure",
      description: "This is a video game yo." 
    }]
  }); 

});

