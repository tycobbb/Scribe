//
// Type Creation 
//

Model = {
  
  // 
  // constructs a new model class from the parameterized collection
  //

  extend: function(collection) {
    
    // create a dummy constructor function that extends this object 
    var Inherited = function(doc) {
      _.extend(this, doc); 
    };

    Inherited.prototype = this;
    
    // store the parameterized collection on the inherited model type
    Inherited._collection = collection;
    
    // shim in our own transform on the collection, to turn any mongo docs
    // into models 
    var transform = collection._transform;
    
    collection._transform = function(doc) {
      var model = new Inherited(doc);

      if(transform) {
        transform(model);   
      }

      return model;
    };

    // finally, return the inherited model type
    return Inherited; 
  }   

};

//
// Relationships
//

Relationship = {
  toOne: 'toOne',
  toMany: 'toMany',  
  belongsTo: 'belongsTo'
};

// adds helper functions for fetching related models based on the name of 
// the related collection 
Model.relationship = function(collectionName, relationshipType) {

  var self = this;

  // create a helper to find the related collection, or throw an error if 
  // it was never defined 
  function relatedCollection() {
    // attempt to look up the related collection on the global object 
    var relatedCollection = self.global()[collectionName];

    if(!relatedCollection) {
      throw new Error('no related collection found');
    }
    
    return relatedCollection; 
  }

  // build out the names of the helper functions we'll add to this model as 
  // as well as any necessary keys querying
  //
  // TODO: we'd probably want to accept a type of relationship as well, e.g.
  // toOne, toMany, belongsTo, and use that to determine the names of the method.
  var findName   = collectionName;
  var foreignKey = self.collection.name + 'Id';
  
  // add the find function
  self[findName] = function(query) {
    var relationship = relatedCollection(); 

    // we want to query for our id on the related collection
    query = _.extend(query || {}, {
      foreignKey: this._id  
    });

    relationship.findOne.apply(arguments); 
  };
     
};

Model.toOne = function(collectionName) {
  this.relationship(collectionName, Relationship.toOne);
};

Model.toMany = function(collectionName) {
  this.relationship(collectionName, Relationship.toMany);
};

Model.belongsTo = function(collectionName) {
  this.relationship(collectionName, Relationship.belongsTo);
};

//
// Shared Behavior
//

// returns the collection associated with this model
Model.collection = function() {
  return this._collection;  
};

// returns the correct global object for the client/server, repsectively
Model.global = function() {
  return window || global;
};

