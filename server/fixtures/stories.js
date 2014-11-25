
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
      description: "A tale about a family who couldn't manage their openness (or lack thereof). Also 'The Entertainment'."
    },{
      title: "Barbie's Horse Adventure",
      description: "This isn't really a story."
    }]
  }); 

});

