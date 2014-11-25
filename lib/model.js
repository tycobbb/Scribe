//
// Type Creation 
//

Model = {
  
  // 
  // constructs a new model class from the parameterized collection
  //

  extend: function(collection) {
    
    // create a new 'Type' so that the caller of extend can perform further customization
    var Subtype = Object.create(this);
    Subtype.parent = this;

    // create a constructor function. it shadows the outer 'Model' object (so that it prints 
    // 'Model' as the type in console) object, so be careful. 
    var Model = function(doc) {
      _.extend(this, doc);     
    };
    
    // setup the prototype chain properly 
    Subtype.constructor = Model;
    Model.prototype = Subtype;
    
    // store the parameterized collection on the inherited model type
    Subtype._collection = collection;
    
    // shim in our own transform on the collection, to turn any mongo docs
    // into models 
    var transform = collection._transform;
    
    collection._transform = function(doc) {
      var model = Subtype.init(doc);

      if(transform) {
        model = transform(model);   
      }

      return model;
    };

    // finally, return the inherited model type
    return Subtype; 
  },
  
  init: function(doc) {
    return new this.constructor(doc);
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
  if(this.parent !== Model) {
    throw new Error('Model.create doesn\'t support inherited models yet');
  }

  // TODO: this is the part that doesn't support inherited models
  var data = _.pick(this, _.keys(this));
  
  return data;
};

//
// Relationships
//

//
// @brief Adds helper functions for fetching related models 
//
// The collection path is a period-delimited keypath that will be used to locate the
// the collection.
//  
// @param collectionPath: The name of the related collection (expected to be plural)
// @param helpers: Object specifyying relationship-type-specific helper functionality 
//
Model.relationship = function(collectionPath, helpers) {
  var self = this,
      components = collectionPath.split('.');

  // create a helper to find the related collection, or throw an error if 
  // it was never defined 
  function relatedCollection() {
    // attempt to look up the related collection on the global object 
    var relatedCollection = components.reduce(function(memo, component) {
      return memo[component];    
    }, self.global());

    if(!relatedCollection) {
      throw new Error('no related collection found');
    }
    
    return relatedCollection; 
  }

  // add the find function
  self[helpers.find.name] = function(query) { 
    var args = _.toArray(arguments);
    if(!query) {
      query = args[0] = {}; 
    }

    // allow the helper to update the query 
    helpers.find.query(this, query); 
    
    // run the query on the related collection
    var collection = relatedCollection();
    return collection.find.apply(collection, args); 
  };

  return self; 
};

function Helpers(collectionPath, alias) {
  this.alias = alias || collectionPath;    
}

// adds helper functions for a toOne relationship
Model.toOne = function(collectionPath, alias) { 
  var helpers = new Helpers(collectionPath, alias);
  
  helpers.find = {
    // toOne find helper: "<relationship>"
    name: helpers.alias.singularize(),

    // toOne find query stores the foreign key on this object: "<relationship>Id"
    query: function(model, query) {
      var foreignKey = this.name + 'Id';
      query._id = model[foreignKey];
    }
  };

  return this.relationship(collectionPath, helpers);
};

// adds helper functions for a toMany relationship
Model.toMany = function(collectionPath, alias) {
  var helpers = new Helpers(collectionPath, alias);

  helpers.find = {
    // toMany find helper: "<relaionships>"
    name: helpers.alias,

    // toMany find query stores the foreign keys on this object: "<relationship>Ids"
    query: function(model, query) {
      var foreignKey = this.name.singularize() + 'Ids';
      query._id = { $in: model[foreignKey] || [] };
    }
  }

  return this.relationship(collectionPath, helpers);
};

// adds helper functions for a belongsTo relationship
Model.belongsTo = function(collectionPath) {
  // TODO: support aliasing for belongsTo relationships
  var helpers = new Helpers(collectionPath, null); 
  
  // TODO: support belongsTo where the related collection has a toMany relationship to
  // this collection

  helpers.find = {
    // belongsTo find helper: "<relationship>"
    name: collectionPath.singularize(),

    // belongsTo query stores the foreign key on the related object: "<localCollection>Id"
    query: function(model, query) {
      var localName  = model.collection()._name;
      var foreignKey = localName.singularize() + 'Id';
      query[foreignKey] = model._id;
    }
  };

  return this.relationship(collectionPath, helpers);
};

