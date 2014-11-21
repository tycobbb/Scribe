Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	if (options.profile)
    	user.profile = options.profile;
  	
  	user.profile.newUser = true;
  	
  	return user;
});
