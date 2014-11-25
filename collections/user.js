
User = Model.extend(Meteor.users);

User.displayName = function() {
  return this.emails ? this.emails[0] : this.profile.name || this._id;
};

getSearchUsers = function(query) {
    var re = new RegExp(query, "i");
    return Meteor.users.find(
    	{
    		'username': {$regex: re}, 
    		'profile.anonymous': { $ne: 'anonymous' }
    	}
    );
}