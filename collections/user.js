
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

Meteor.users.getSearchUsers = function(query, userId) {
	var re = new RegExp(query, "i");
	return this.find(
		{
			'username'			: { $regex: re }, 
			'profile.anonymous'	: { $ne: 'anonymous' },
			'_id'				: { $ne: userId }
		}
	);
};

Meteor.users.isAnonymous = function(userId) {
	var user = this.findOne({'_id': userId});
	if(!user) return true;
	return user.profile.anonymous ? true : false;
}