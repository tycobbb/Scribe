
User = Model.extend(Meteor.users);

User.displayName = function() {
  if(this.profile && this.profile.name) {
    return this.profile.name;
  }
  else if(this.username) {
    return this.username;
  }
  else if(this.emails && this.emails[0] && this.emails[0].address) {
    return this.emails[0].address;
  }

  return '';
};

User.getSearchUsers = function(query) {
	var re = new RegExp(query, "i");
	return Meteor.users.find(
		{
			'username'			: { $regex: re }, 
			'profile.anonymous'	: { $ne: 'anonymous' }
		}
	);
};

