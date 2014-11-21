var loginButtonsSession = Accounts._loginButtonsSession;

Template.anonymousSignIn.events({
	'submit' : function(event) {
		var name = $('#anonNameInput').val();
		Anonymous.add(name);
		event.preventDefault();
	}
});

Template.anonymousSignIn.helpers({
	'showAnonymousSignIn': function() {
		return loginButtonsSession.get('inSignupFlow');
	}
});

Template.signin.rendered = function() {
	this.autorun(function (currentComp) {
		var user = Meteor.user();
		if(user) {
			if(user.profile && user.profile.newUser){			
				console.log('New User!');
				Router.go('/intro');
	  		} else {
	  			console.log('Old Bro!');
	  			Router.go('/browse');
	  		}  		
	  		currentComp.stop();
	  	} else {
	  		console.log('no user');
	  	}
	});
}