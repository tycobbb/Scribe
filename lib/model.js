//
// Type Creation 
//

Model = {
  
  // 
  // constructs a new model class from the parameterized collection
  //

  extend: function(collection) {
    
    // create a dummy constructor function that extends this object. it does shadow
    // the outer model so that the type name in console is still model (be careful).
    var Model = function(doc) {
      _.extend(this, doc); 
    };
    
    Model.prototype = this;
    
    // store the parameterized collection on the inherited model type
    Model.prototype._collection = collection;
    
    // shim in our own transform on the collection, to turn any mongo docs
    // into models 
    var transform = collection._transform;
    
    collection._transform = function(doc) {
      var model = new Model(doc);

      if(transform) {
        model = transform(model);   
      }

      return model;
    };

    // finally, return the inherited model type
    return Model; 
  }   

};

//
// Accessors 
//

// returns the collection associated with this model
Model.collection = function() {
  return this._collection;  
};

// returns the correct global object for the client/server, repsectively
Model.global = function() {
  return window || global;
};

//
// Synchronization
//

Model.create = function(methodOrCallback, callback) {
  var self = this;

  // extract the data to insert,
  var data = self.asData(); 
  
  // determine the method name / callback based on the type of flex parameter 
  var hasMethodName = typeof methodOrCallback === "string"; 
 
  // if we have no method name, this is a plain old insert 
  if(!hasMethodName) {
    callback = methodOrCallback;

    // insert the data, and update the model
    self._id = self.collection().insert(data, callback);  
  } 
  
  // otherwise, let's call the corresponding server method 
  else {
    var methodName = methodOrCallback;
    Meteor.call(methodName, data, function(error, result) { 
      // update the the model and callback the handler if possible
      if(result && !error) {
        _.extend(self, result);
      }  
      
      if(callback) {
        callback(error); 
      }  
    });
  } 
};

Model.remoteCreate = function(callback) {
  // infer the method name in the form of "create<Type>"
  var methodName = 'create' + this.collection()._name.singularize().capitalize(); 
  // call the method 
  this.create(methodName, callback);
};

Model.asData = function() {
  if(Object.getPrototypeOf(this) !== Model) {
    throw new Error('Model.create doesn\'t support inherited models yet');
  }

  // TODO: this is the part that doesn't support inherited models
  var data = _.pick(this, _.keys(this));
  
  return data;
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

