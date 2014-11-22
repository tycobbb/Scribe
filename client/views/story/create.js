//
// Template
//

Template.create.helpers({

  form: function() {
    return new StoryForm();    
  },

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
        placeholder: 'Infinite Test'
      }),
   
      new StoryField(this, {
        name: 'Description',
        key: 'description',
        placeholder: 'The unjustifiably satisfying greenery of the thing was what drove Hal\'s secret pursuit...'
      })
    ]

  },{
    name: 'Prompt',
    
    fields: [
      new StoryField(this, {
        name: 'Prompt',
        key: 'prompt',
        template: 'formPromptField',
        placeholder: 'Write your own prompt, or start with an existing one that suits your fancy.'
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

StoryForm.prototype.updatedField = function(field, value) { 
  // update the model
  this.form.story[field.key] = value;
};

//
// Field -- View model backing a story form field
//

function StoryField(form, options) {
  // apply the options
  _.defaults(this, options);
  
  this.form = form;
  this.template = options.template || 'formField';
}

StoryField.prototype.update = function(value) {
  this.form.updatedField(this, value);
};

