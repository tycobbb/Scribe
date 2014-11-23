
IntroController = ApplicationController.extend({
  title: 'Intro',  

  onRun: function() {
    var self = this;

    console.log('IntroController onRun!');
   	var user = Meteor.user();
   	if(user && user.profile && user.profile.newUser) {
   		delete user.profile.newUser;
   	}
  },
});

