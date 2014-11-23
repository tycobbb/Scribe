
Template.header.helpers({
  
  title: function() {
    return Session.get('title');
  },
  
  buttons: function() {
    return Session.get('header-buttons');
  },

});

// for convenience
var loginButtonsSession = Accounts._loginButtonsSession;

// shared between dropdown and single mode
Template.logout.events({
  'click #logoutButton': function(event) {
    Meteor.logout(function () {
      loginButtonsSession.closeDropdown();
      Router.go('/signin');
    });
    event.preventDefault();
  }
});

Template.logout.helpers({
  displayName: displayName,
  isLoggedIn: isLoggedIn
});

function isLoggedIn() {
  var user = Meteor.user();
  return user ? user : false;
}

function displayName() {
  var user = isLoggedIn();

  if (user.profile && user.profile.name)
    return user.profile.name;
  if (user.username)
    return user.username;
  if (user.emails && user.emails[0] && user.emails[0].address)
    return user.emails[0].address;

  return '';
};