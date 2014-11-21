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

//
// Template
//

Template.create.helpers({
  
  groups: function() {
    return groups;  
  }

});

Template.create.events({
  
  'submit .main-form': function(event, template) {
    event.preventDefault();

    // get the keys of all the fields in the form 
    var keys = _.chain(groups)
      .map(function(group) { return group.fields; })
      .flatten()
      .pluck('key')
      .value();
   
    // create the data for a story by pulling the values of all
    // fields in the form 
    var story = {};
    keys.forEach(function(key) {
      story[key] = $(event.target).find('[name=' + key + ']').val();
    });

    // create the story
    Stories.insert(story); 
  }
  
});

