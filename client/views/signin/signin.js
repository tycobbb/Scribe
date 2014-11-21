var loginButtonsSession = Accounts._loginButtonsSession;

Template.anonymousSignIn.events({
	'submit' : function(event) {
		var name = $('#anonNameInput').val();
		Anonymous.add(name);
		event.preventDefault();
	}
})

Template.anonymousSignIn.helpers({
	'showAnonymousSignIn': function() {
		return loginButtonsSession.get('inSignupFlow');
	}
})