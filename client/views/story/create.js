//
// Form Model
//

function Form() {
    
  this.story = new Story();
 
  this.groups = [{ 
    name: 'Info',
    
    fields: [
      new Field(this, {
        name: 'Title',
        key: 'title',
        placeholder: 'Cryptonomichronic'
      }),
   
      new Field(this, {
        name: 'Description',
        key: 'description',
        placeholder: 'A lengthy tome delving into the economics of small-time drug dealers on the gold standard.'
      })
    ]
  }];

};

//
// Field Model
//

function Field(form, options) {
  _.defaults(this, options);
  this.form = form;
}

Field.prototype.update = function(value) {
  // updat the model
  this.form.story[this.key] = value;    
};

//
// Template
//

Template.create.helpers({

  form: function() {
    return new Form();    
  },

  submitDisabled: function() {
    return false ? 'disabled="disabled"' : '';  
  }

});

Template.create.events({

  'keyup .form-input': function(event, template) {
    this.update($(event.target).val());
  },
  
  'submit .main-form': function(event, template) {
    event.preventDefault(); 
     
    var self = this;

    // sync the story 
    self.story.create(function(error) {
      // TODO: handle errors, perhaps using the reactive error biznaz
      if(!error) {
        Router.go('story', self.story);
      }   
    });
  }
  
});

