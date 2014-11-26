
Fixtures.group(function(group) {
  
  group.collection = Lines;
  group.depend(Stories);

  group.run(function(fixtures) { 
    
    var stories = Stories.find().fetch();

    fixtures.insert({
      // create a line record from each story
      records: _.map(stories, function(story) {
        return {
          text: 'Dummy first line.',
          storyId: story._id  
        }; 
      }),

      after: function(line) {
        Stories.update(
         { _id: line.storyId },
         { $set: { lineIds: [ line._id ] } }
        ); 
      }

    });

  });

});

