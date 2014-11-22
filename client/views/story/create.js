//
// Template
//

Template.create.helpers({

  form: function() {
    return new StoryForm();    
  },

  submitDisabled: function() {
    return false ? 'disabled="disabled"' : '';  
  }

});

Template.create.events({

  'keyup .form-input': function(event, template) {
    // this is a field
    this.update($(event.target).val());
  },
  
  'submit .main-form': function(event, template) {
    event.preventDefault();     
    // this is the form 
    this.save();
  }
  
});

//
// Form -- View model backing the story create form
//

function StoryForm() {
  
  // backing data model   
  this.story = new Story();
   
  // form configuration
  this.groups = [{ 
    name: 'Info',
    
    fields: [
      new StoryField(this, {
        name: 'Title',
        key: 'title',
        placeholder: 'Cryptonomichronic'
      }),
   
      new StoryField(this, {
        name: 'Description',
        key: 'description',
        placeholder: 'A lengthy tome delving into the economics of small-time drug dealers on the gold standard.'
      })
    ]
  }];

};

StoryForm.prototype.save = function(callback) {
  var self = this;
  
  // sync the story 
  self.story.create(function(error) {
    // TODO: handle errors, perhaps using the reactive error biznaz
    if(!error) {
      Router.go('story', self.story);
    }   
  });
};

//
// Field -- View model backing a story form field
//

function StoryField(form, options) {
  _.defaults(this, options);
  
  this.form = form;
}

StoryField.prototype.update = function(value) {
  // update the model
  this.form.story[this.key] = value;    
};

