///// aldeed:autoform
/* packages
  meteor add mongo
  meteor add accounts-password
  meteor add fortawesome:fontawesome
*/

//////////// Global stuff? is that right?
Lists = new Mongo.Collection("lists");
Files = new Mongo.Collection("files");
Favorites = new Mongo.Collection("favorites");


//////////// client stuff
if (Meteor.isClient) {
  Template.body.helpers({
    files: function () {
      return Files.find({}, {sort: {name: 1}});
    },
    notMylists: function () {
      return Lists.find({ownerId: {$ne: Meteor.userId()}}, {sort: {name: 1}});
    },
    myLists: function () {
      return Lists.find({ownerId: Meteor.userId()}, {sort: {name: 1}});
    }
  });

  Template.body.events({
    "submit .new-file": function (event) {
      // This function is called when the new task form is submitted
      var fileName = event.target.fileName.value;

      // do stuff here dog

      Files.insert({
        name: fileName,
        ownerId: Meteor.userId(),
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.fileName.value = "";

      // Prevent default form submit
      return false;
    },

    "submit .new-list": function (event) {
      // This function is called when the new task form is submitted
      var listName = event.target.listName.value;

      // do stuff here dog

      Lists.insert({
        name: listName,
        ownerId: Meteor.userId(),
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.listName.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.file.events({
    "click .favorite": function () {
      // search for file id in user's favorites
      var index = Meteor.user().profile.favorites.indexOf(this._id);
      if (index > -1) {
        // remove the file id if found
        Meteor.users.update(Meteor.userId(), {$pull: {"profile.favorites": this._id}}, {multi: true});
      } else {
        // add the file id if not found
        Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.favorites": this._id}});  
      }
    }
  });

  Template.myList.events({
    "click .delete": function () {
      // TODO: confirm
      Lists.remove(this._id);
    }
  });

  Template.file.helpers({
    "isFavorite": function () {
      // search for file in in user's favorites
      var index = Meteor.user().profile.favorites.indexOf(this._id);

      // return a bootstrap class for row highlighting
      // TODO: replace the info css. is this right? setting style in the js?
      return ((index > -1) ? "fa-heart" : "fa-heart-o");
    }
  });

}


//////////// server stuff
if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });

  // when a user is created we'll need to add some of our properties
  // favorites: an array of the users favorite files
  Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
      user.profile = options.profile;
    } else {
      user.profile = {};
    }
    
    user.profile.favorites = [];
    return user;
  });
}
