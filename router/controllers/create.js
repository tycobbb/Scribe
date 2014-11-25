
CreateController = ApplicationController.extend({
	title: 'Create a Story',  
	
	reactiveUserSearchInput: new ReactiveVar(),

	subscriptions: function() {
    console.log(this.reactiveUserSearchInput.get());
    Meteor.subscribe("searchUsers", this.reactiveUserSearchInput.get());
	}
});

