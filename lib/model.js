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
// The helpers stored on the relationship will be added to the model type
// and then removed from the relationship.
//
// @param relationship A Relationship to another Collection
//
Model.addRelationship = function(relationship) { 
  var self = this;

  if(!self.relationships) {
    self.relationships = [];
  }

  self.relationships.push(relationship);

  // add all the helpers to this model subtype 
  _.chain(relationship.helpers).values().each(function(helper) {
    self[helper.name] = helper.implementation;      
  });
  
  // remove the helpers from the relationship
  delete relationship.helpers;

  return self; 
};

// adds helper functions for a toOne relationship
Model.toOne = function(collectionPath, alias) {  
  // toOne relations store the foreign key on this object: "<relationship>Id"
  var relationship = new Relationship(collectionPath, alias); 
  var foreignKey   = relationship.alias.singularize() + 'Id';

  relationship.find({
    // toOne find helper: "<relationship>"
    name: relationship.alias.singularize(), 

    transform: function(model, query) {
      // look up relation based on our id
      query._id = model[foreignKey];
    }
  });

  return this.addRelationship(relationship);
};

// adds helper functions for a toMany relationship
Model.toMany = function(collectionPath, alias) {
  // toMany relations store the foreign keys on this object: "<relationship>Ids"
  var relationship = new Relationship(collectionPath, alias);
  var foreignKey   = relationship.alias.singularize() + 'Ids';

  relationship.find({
    // toMany find helper: "<relaionships>"
    name: relationship.alias,

    transform: function(model, query) {
      // match any relations in our list of ids
      query._id = { $in: model[foreignKey] || [] };
    }
  });

  return this.addRelationship(relationship);
};

// adds helper functions for a belongsTo relationship
Model.belongsTo = function(collectionPath) {
  // TODO: support aliasing on belongs to
  var relationship = new Relationship(collectionPath, null);   

  relationship.find({
    // belongsTo find helper: "<relationship>"
    name: relationship.alias.singularize(),

    // belongsTo query stores the foreign key on the related object: "<localCollection>Id"
    transform: function(model, query) {
      var localName  = model.collection()._name;
      var foreignKey = localName.singularize() + 'Id';
      query[foreignKey] = model._id;
    }
  });

  return this.addRelationship(relationship);
};

//
// Relationship
//

function Relationship(collectionPath, alias) { 
  // the alias is used to generate the names of the helper functions
  // i.e. a relationship toMany users could be aliased as 'friends'
  this.alias = alias || collectionPath;

  // the related collection will be looked up at runtime by traversing
  // a period-seperated list of objects, starting at the global object
  this.pathComponents = collectionPath.capitalize().split('.');
  
  // helpers will store any...helpers...that are added to this relationship
  // as it's created. these helpers will be transferred to the model.
  this.helpers = {};
}

Relationship.prototype.collection = function() {
  // once we have cached the collection, just return that
  if(this._collection) {
    return this._collection;   
  }
  
  // start at the right global object (client/server) 
  var root = window || global;
  
  // attempt to look up the related collection  
  this._collection = this.pathComponents.reduce(function(memo, component) {
    return memo[component];    
  }, root); 

  if(!this._collection) {
    throw new Error('no related collection found');
  }
  
  return this._collection;  
};

Relationship.prototype.find = function(options) {
  var relationship = this;

  relationship.helpers.find = {
    name: options.name, 
    implementation: function(query) { 
      // make sure we have our minimum arguments
      var args = _.toArray(arguments);
      if(!query) {
        query = args[0] = {}; 
      }

      // apply the custom query transform 
      options.transform(this, query); 
      
      // run the query on the related collection
      var collection = relationship.collection();
      return collection.find.apply(collection, args); 
    }
  };
};

