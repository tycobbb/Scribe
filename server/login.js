Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	if (options.profile)
    	user.profile = options.profile;
  	
  	user.profile.newUser = true;
  	
  	if(!user.username && user.profile.name) {
  		user.username = user.profile.name;
  	}

  	return user;
});