
IntroController = ApplicationController.extend({

  title: 'Intro',  

  onRun: function() {
   	var user = Meteor.user();
   	if(user && user.profile && user.profile.newUser) {
   		Meteor.users.update({ _id: user._id }, { $set:{ "profile.newUser": false } });
   	}
  }

});

