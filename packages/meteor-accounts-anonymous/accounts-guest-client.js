var constructor = (function() {
    /***
     * Creates an instance of Guests
     * @constructor
     */
    function Anonymous() {

    }

    /***
     * Adds a Guest User
     */
    Anonymous.prototype.add = function (name) {
      if (!Meteor.userId()) {
        res = Accounts.createUser({password: Meteor.uuid(), username: Meteor.uuid(), profile: {anonymous: "anonymous", name: name}});
        console.log(res);
      }
    };

    /* make anonymous users kinda non-users -- just ids 
    * this allows the account-base "Sign-in" to still appear */    
    Meteor.user = function () {
      var userId = Meteor.userId();
      if (!userId) {
        return null;
      }
      var user = Meteor.users.findOne(userId);
      /*
      if (user !== undefined &&
          user.profile !== undefined &&
          user.profile.guest) {
        return null;
      }
      */
      return user;
    };

    return Anonymous;

})();

Anonymous = new constructor();

