//
// Collection
//

Lines = new Mongo.Collection('lines');

// enumeration specifying a vote value and doc attribute corresponding 
// to the vote set

Lines.Vote = {  
  up:   { value:  1, set: 'proposal.upvotes' }, 
  down: { value: -1, set: 'proposal.downvotes' },
  none: { value:  0, set: null },
};

//
// Model
//

Line = Model.extend(Lines);
Line.toOne('stories');

