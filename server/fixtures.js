
Meteor.startup(function() {

  function capitalize(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  //
  // Fixtures Helper
  //    

  var settings = Meteor.settings.fixtures;

  Mongo.Collection.prototype.fixtures = function(data) {
    var self = this;
  
    // if fixture rebuilding is off (globally or for this collection), do nothing
    if(!settings.rebuild || !settings.collections[self._name]) {
      return;
    } 
    
    // purge stale data (everything in this colleciton)
    self.remove({});

    // populate each record with the defaults object (if any) and insert it
    data.records.forEach(function(record) {
      record = _.defaults(record, data.defaults);
      self.insert(record);
    });
  };

  //
  // Fixtures
  //

  Stories.fixtures({ 

    defaults: {
      isGreat: true
    },

    records: [{
      title: "Ender's Game"
    },{
      title: "Infinite Jest"
    },{
      title: "Barbie's Horse Adventure" 
    }]

  });

});

