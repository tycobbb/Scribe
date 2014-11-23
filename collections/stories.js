//
// Collection
//

Stories = new Mongo.Collection('stories');

Stories.active = function() {
  return Stories.find({});
};

Stories.participating = function() {
  return Stories.find({});
};

//
// Model 
//

Story = Model.extend(Stories);

