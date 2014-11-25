
// declare storage for the fixtures helper
var settings = Meteor.settings.fixtures;

// hook for collections to register their fixtures
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

