//
// Template
//
Template.create.helpers({

  form: function() {
    return new StoryForm();
  }

});

Template.userSearchField.helpers({
  users: function() {
    return getSearchUsers(Iron.controller().reactiveUserSearchInput.get());
  }
});

var $searchContainer = $('.user-search-container');

Template.create.events({

  'keyup .form-input, keyup .form-textarea': function(event, template) {
    // this is a field
    this.update($(event.target).val());
  },

  'change .form-checkbox': function(event, template) {
    var checked = $(event.target).is(":checked")
    this.update(checked);
    checked ? $searchContainer.show() : $searchContainer.hide();
  },
  
  'submit .main-form': function(event, template) {
    event.preventDefault();     
    // this is the form 
    this.save();
  },

  'keyup #userSearchInput': function(event, template) {
    var value = $(event.target).val();
    if(value.length >= 3) {    
      Iron.controller().reactiveUserSearchInput.set(value);
    }
  },

  'click .add-participant': function(event, template) {
    console.log(this.user);
    console.log(this.parent);
  }

});

//
// Form -- View model backing the story create form
//

function StoryForm() {
  
  // backing data model   
  this.story  = new Story();
  this.groups = [];
   
  // build out models for the groups of fields that will drive the content of
  // of the form.
  
  // starting with the 'info' group: metadata, etc.
  var infoGroup = this.insertGroup({
    name: 'Give your story a name.'
  });

  infoGroup.insertField({
    name: 'Title',
    key: 'title',
    placeholder: 'Infinite Test'
  });

  infoGroup.insertField({
    name: 'Description',
    key: 'description',
    placeholder: 'The unjustifiably satisfying greenery of the thing was what drove Hal\'s secret pursuit...',
    template: 'formTextAreaField'
  });

  infoGroup.insertField({
    name: 'Private Group?',
    key: 'private',
    template: 'formCheckboxField'
  });

  // the 'content' group: prompt, intro text, etc.
  var contentGroup = this.insertGroup({
    name: 'What\'s your story about?'
  })
    
  contentGroup.insertField({
    name: 'Prompt',
    key: 'prompt',
    template: 'formTextAreaField',
    placeholder: 'Write your own prompt, or start with an existing one that suits your fancy.'
  });

  contentGroup.insertField({
    name: 'Start \'er off',
    key: 'body',
    placeholder: 'Write the initial paragraph, if you\'d like, to get things going.',
    template: 'formTextAreaField'
  });

  var userGroup = this.insertGroup({
    name: 'Invited Users'
  });

  userGroup.insertField({
    name: 'Invited Users',
    key: 'participantIds',
    template: 'userSearchField'
  });

};

// creates, appends, and returns a new group with the specified options
StoryForm.prototype.insertGroup = function(options) {
  var group = new StoryGroup(this, options);
  this.groups.push(group);
  return group;  
};

StoryForm.prototype.save = function(callback) {
  var self = this;
  
  // sync the story 
  self.story.remoteCreate(function(error) {
    // TODO: handle errors, perhaps using the reactive error biznaz
    if(!error) {
      Router.go('story', self.story);
    }   
  });
};

StoryForm.prototype.addParticipant = function(_id) {
  if(!this.story.participants) this.story.participants = [];
  this.insertField({
    _id:_id
  });
  this.story.participants.push(userId);
}

StoryForm.prototype.removeParticipant = function(_id) {
  var index = this.story.participants.indexOf(_id);
  if(index > -1) {
    this.story.participants.splice(index, 1);
  }
}

StoryForm.prototype.updatedField = function(field, value) { 
  // update the model
  this.story[field.key] = value;
};

//
// Group -- View model backing a stroup field-group
//

function StoryGroup(form, options) {
  // apply the options
  _.defaults(this, options);    

  this.form = form;
  this.fields = [];
};

// creates, appends, and returns a new field with the specified options
StoryGroup.prototype.insertField = function(options) {
  var field = new StoryField(this.form, options);
  this.fields.push(field);
  return field;
};

//
// Field -- View model backing a story form field
//

function StoryField(form, options) {
  // apply the options
  _.defaults(this, options);
  
  this.form = form;
  this.template = options.template || 'formInputField';
}

StoryField.prototype.update = function(value) {
  this.form.updatedField(this, value);
};