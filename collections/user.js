
User = Model.extend(Meteor.users);

User.displayName = function() {
  return this.emails ? this.emails[0] : this.profile.name || this._id;
};

