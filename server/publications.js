//
// Browse
//

Meteor.publish('stories-active', function() {
  return Stories.findActive(this.userId);  
});

Meteor.publish('stories-participating', function() {
  return Stories.findByParticipantId(this.userId); 
});

//
// Story
//

Mongo.Collection.prototype.publishRelation = function(options) {
  var self = options.publication,
      collection = this,
      handles = {};  
  
  function observeRelationForDoc(doc) {
    // tear down any existing observation on the relation 
    var ids = doc[options.key];

    if(handles[options.key]) {
      handles[options.key].stop();   
    }
    
    // do nothing if we have no relations to observe
    if(!ids) {
      return;   
    }

    // observe the relations and add them as they come in
    handles[options.key] = options.relation.find({
      _id: { $in: ids }
    }).observe({
      added: function(doc) {
        self.added(options.relation._name, doc._id, doc);
      },
      removed: function(doc) {
        self.removed(options.relation._name, doc._id);
      }  
    });
  }
  
  // observe the story and rebuild the user handle as it changes
  handles.root = collection.find({
    _id: options.id 
  }).observeChanges({
    // if the story is added, observe its users
    added: function(id, doc) {
      observeRelationForDoc(doc);
    },
    // if participantIds changes, re-observe the users
    changed: function(id, fields) {
      if(_.has(fields, options.key)) {
        observeRelationsForDoc(fields); 
      }
    },
    // if the story is removed, stop the publication
    removed: function() {
      self.stop();  
    }
  });

  self.onStop(function() {
    delete options.publication;
    
    // stop all our observations 
    _.chain(handles).values().each(function(handle) {
      handle.stop();
    });
  });
};

Meteor.publish('story-detail', function(storyId) {
  check(storyId, String);
  return Stories.find({
    _id: storyId
  });
});

Meteor.publish('story-users', function(storyId) {
  check(storyId, String);  

  Stories.publishRelation({
    id: storyId,
    relation: Meteor.users,
    key: 'participantIds',
    publication: this
  }); 
});

Meteor.publish('story-lines', function(storyId) {
  check(storyId, String);
  
  Stories.publishRelation({
    id: storyId,
    relation: Lines,
    key: 'lineIds',
    publication: this
  });
});

//
// Dyanmic User Search
//

Meteor.publish("searchUsers", Meteor.users.getSearchUsers);

