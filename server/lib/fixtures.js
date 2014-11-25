
// declare storage for the fixtures helper
var settings = Meteor.settings.fixtures;

console.log('fixtures: ' + (settings.rebuild ? 'enabled' : 'disabled'));

// hook for collections to register their fixtures
Mongo.Collection.prototype.fixtures = function(data) {
  var self = this;
  
  // do nothing at all if fixtures are disabled globally
  if(!settings.rebuild) {
    return; 
  }
  
  var collectionName = self._name; 
  var shouldRebuild  = settings.collections[collectionName];
   
  console.log('fixtures.' + collectionName + ': ' + (shouldRebuild ? 'rebuilding...' : 'disabled'));
  
  if(shouldRebuild) {
    // purge stale data (everything in this colleciton)
    self.remove({});

    // populate each record with the defaults object (if any) and insert it
    data.records.forEach(function(record) {
      record = _.defaults(record, data.defaults);
      self.insert(record);
    }); 
  } 
 };

