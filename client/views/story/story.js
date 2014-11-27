//
// Editor
//

Template.editorInput.helpers({
  lineEditor: function() {
    return new LineEditor(this); 
  }
});

Template.editorInput.events({

  'keyup .story-input': function(event, template) {
    this._text.set($(event.target).val());
  },

  'submit .story-form': function(event, template) {
    event.preventDefault();    
    this.submit();
  },

  'reset .story-form': function(event, tempalte) {
    event.preventDefault();  
    this.reset(); 
  }
     
});

function LineEditor(story) {
  this.story = story;
  this._text = new ReactiveVar();
  this.reset();
}

LineEditor.prototype.text = function() {
  return this._text.get();
};

LineEditor.prototype.submit = function() {
  //self.story.addLine({
    //text: this._text.get()
  //});
};

LineEditor.prototype.reset = function() {
  this._text.set('');
};

