Template.anonymousSignIn.events({
	'submit' : function(event) {
		var name = $('#anonNameInput').val();
		Anonymous.add(name);
		event.preventDefault();
	}
})