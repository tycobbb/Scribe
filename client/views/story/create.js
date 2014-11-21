//
// Form Model
//

var groups = [{
  
  name: 'Info',
  
  fields: [{
    name: 'Title',
    key: 'title',
    placeholder: 'Cryptonomichronic'
  },{
    name: 'Description',
    key: 'description',
    placeholder: 'A lengthy tome delving into the economics of small-time drug dealers on the gold standard.'
  }]

}];

var story = {};

//
// Template
//

Template.create.helpers({
  
  groups: function() {
    return groups;  
  },

  submitDisabled: function() {
    return false ? 'disabled="disabled"' : '';  
  }

});

Template.create.events({

  'keyup .form-input': function(event, template) {
    var input = $(event.target);
    var key   = input.attr('name'),
        value = input.val();

    story[key] = value; 
  },
  
  'submit .main-form': function(event, template) {
    event.preventDefault();

    // create the story
    Stories.insert(story); 
  }
  
});

