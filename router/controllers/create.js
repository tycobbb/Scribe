
CreateController = ApplicationController.extend({
	title: 'Create a Story',  

	reactiveUserSearchInput: new ReactiveVar(),

	subscriptions: function() {
    Meteor.subscribe("searchUsers", this.reactiveUserSearchInput.get());
	}
});

