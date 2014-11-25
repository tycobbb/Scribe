getSearchUsers = function(query) {
    var re = new RegExp(query, "i");
    return Meteor.users.find({'profile.name': {$regex: re}});
}