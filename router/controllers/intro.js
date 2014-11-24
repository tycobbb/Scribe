
IntroController = ApplicationController.extend({
  title: 'Intro',  

  onRun: function() {
    var self = this;

   	var user = Meteor.user();
   	if(user && user.profile && user.profile.newUser) {
   		Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.newUser":false}})
   	}
  },
});

