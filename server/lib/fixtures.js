//
// Setup 
//

var settings = Meteor.settings.fixtures;
var preventFixtures = !settings.rebuild || process.env.PREVENT_FIXTURES;

console.log('fixtures: ' + (preventFixtures ? 'disabled' : 'enabled'));

//
// Interface
//

Fixtures = {
  
  resolved: [],
  queue: [],

  group: function(closure) {
    var self = this;

    // run the closure at startup
    Meteor.startup(function() {
      // allow the caller to construct the new group
      var group = new FixtureGroup(); 
      closure.call(group);
      
      if(!group.collection) {
        throw new Execption('no-collection', 'fixture groups must have a collection');
      }

      // clear out any dependencies that have already been processed
      group.removeDependencies(self.resolved);

      // add this group to the queue, and then attempt to run any groups we can 
      self.queue.push(group);  
      self.drain();
    });    
  }, 

  drain: function() {
    // find a group we can run
    var group = _.find(this.queue, function(group) {
      return group.isReady(); 
    });
    
    // if we found one, then let's run it!
    if(group) {
      group.execute();
      group.finish();
      
      // update the global state 
      var collection = group.collection;

      this.queue = _.without(this.queue, group);  
      this.resolved.push(collection);
    
      // update dependencies of other groups
      _.each(this.queue, function(group) {
        group.removeDependency(collection);       
      });

      // recurse to see if we can complete another group
      this.drain(); 
    }  
  }
};

//
// Fixture Group 
//

var FixtureGroup = function(collection) {
  this.collection   = collection;
  this.builders     = [];
  this.dependencies = [];
  this.fixtures     = [];
};

//
// Building 
FixtureGroup.prototype.depend = function(collection) {
  this.dependencies.push(collection);  
  return this;
};

FixtureGroup.prototype.run = function(builder) {
  this.builders.push(builder);
  return this; 
};

//
// Fixture adding
FixtureGroup.prototype.add = function(data) {
  this.fixtures.push(new Fixture(this.collection, data));
};

//
// Internal
FixtureGroup.prototype.removeDependency = function(collection) {
  this.dependencies = _.without(this.dependencies, collection);
};

FixtureGroup.prototype.removeDependencies = function(collections) {
  this.dependencies = _.difference(this.dependencies, collections); 
};

FixtureGroup.prototype.isReady = function() {
  return this.dependencies.length === 0;  
};

FixtureGroup.prototype.execute = function() {
  var self = this;

  // don't run fixtures if they're disabled globally
  if(preventFixtures) {
    return;   
  }

  var collectionName = self.collection._name;
  var shouldRebuild  = settings.collections[collectionName];
   
  console.log('fixtures.' + collectionName + ': ' + (shouldRebuild ? 'rebuilding...' : 'disabled'));

  if(shouldRebuild) {
    // purge stale data (everything in this colleciton)
    self.collection.remove({});

    // allow the builders to populate our fixtures
    _.each(self.builders, function(builder) {
      builder.call(self);
    });
    
    // then run all the fixtures
    _.each(self.fixtures, function(fixture) {
      fixture.execute();  
    });
  } 
};

FixtureGroup.prototype.finish = function() {
  this.builders = null;
  this.fixtures = null;
};

//
// Fixture
//

var Fixture = function(collection, data) {
  this.collection = collection;
  this.data = data;
};

Fixture.prototype.execute = function() {
  var self = this;
    
  // populate each record with the defaults object (if any) and insert it
  _.each(self.data.records, function(record) {
    record = _.defaults(record, self.data.defaults);
    self.collection.insert(record);
  }); 
};

