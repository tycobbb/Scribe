
Template.participants.helpers({ 
  name: function() {
    if(this.emails) {
      return this.emails[0];   
    }

    return this.profile.name || this._id;
  }   
});

