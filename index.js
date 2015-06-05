///// aldeed:autoform
/* packages
  meteor add mongo
  meteor add accounts-password
  meteor add accounts-ui
  meteor add iron:router
  meteor add fortawesome:fontawesome
  meteor add rubaxa:sortable
*/

Lists = new Mongo.Collection("lists");
Files = new Mongo.Collection("files");

//////////// server stuff
// TODO: How do I move this into another file?
if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });

  // when a user is created we'll need to add some of our properties
  // favorites: an array of the users favorite files/lists
  Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
      user.profile = options.profile;
    } else {
      user.profile = {};
    }
    // user favorite arrays; files and lists
    user.profile.favoriteFiles = [];
    user.profile.favoriteLists = [];
    return user;
  });
}


//////////// client stuff
if (Meteor.isClient) {
  
  /*************************
      Template Helpers (ntunes.js)
  **************************/
  Template.listDisplay.helpers({
    myLists: function () {
      // return lists the users owns (created)
      return Lists.find({ownerId: Meteor.userId()}, {sort: {name: 1}});
    },
    favoriteLists: function () {
      // TODO: the refernce to favoriteLists doesn't seem to work unless I store it in a variable
      // return lists the user does not own and has marked as a favorite
      var favorites = Meteor.user().profile.favoriteLists;
      return Lists.find({$and: [{ownerId: {$ne: Meteor.userId()}}, {_id: {$in: favorites}}]}, {sort: {name: 1}});
    },
    otherLists: function () {
      // return lists the users does not own and has not marked as a favorite
      var owner = Meteor.userId();
      var favorites = Meteor.user().profile.favoriteLists;
      return Lists.find({$and: [{ownerId: {$ne: owner}}, {_id: {$nin: favorites}}]}, {sort: {name: 1}});
    }
  });

  Template.fileDisplay.helpers({
    myFiles: function () {
      // return files the user owns (posted)
      var owner = Meteor.userId();
      return Files.find({ownerId: owner}, {sort: {name: 1}});
    },
    favoriteFiles: function () {
      // return files the user does not own and has marked as a favorite
      var owner = Meteor.userId();
      var favorites = Meteor.user().profile.favoriteFiles;
      return Files.find({$and: [{ownerId: {$ne: owner}}, {_id: {$in: favorites}}]}, {sort: {name: 1}});
    },
    otherFiles: function () {
      // return files the users does not own and has not marked as a favorite
      var owner = Meteor.userId();
      var favorites = Meteor.user().profile.favoriteFiles;
      return Files.find({$and: [{ownerId: {$ne: owner}}, {_id: {$nin: favorites}}]}, {sort: {name: 1}});
    }
  });

  Template.newList.events({
    "submit .new-list": function (event) {
      // TODO: don't allow blank names
      // This function is called when the new task form is submitted
      var listName = event.target.listName.value;

      // insert a list with the submitting user as owner
      Lists.insert({
        name: listName,
        ownerId: Meteor.userId(),
        files: [],
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.listName.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.newFile.events({
    "submit .new-file": function (event) {
      // This function is called when the new task form is submitted
      var fileName = event.target.fileName.value;

      // insert a file with the submitting user as owner
      Files.insert({
        name: fileName,
        ownerId: Meteor.userId(),
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.fileName.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.file.events({
    "click .favorite": function () {
      // search for file id in user's favorites
      var index = Meteor.user().profile.favoriteFiles.indexOf(this._id);
      if (index > -1) {
        // remove the file id if found
        Meteor.users.update(Meteor.userId(), {$pull: {"profile.favoriteFiles": this._id}}, {multi: true});
      } else {
        // add the file id if not found
        Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.favoriteFiles": this._id}});  
      }
    }
  });

  Template.list.events({
    "click .favorite": function () {
      // search for file id in user's favorites
      var index = Meteor.user().profile.favoriteLists.indexOf(this._id);
      if (index > -1) {
        // remove the file id if found
        Meteor.users.update(Meteor.userId(), {$pull: {"profile.favoriteLists": this._id}}, {multi: true});
      } else {
        // add the file id if not found
        Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.favoriteLists": this._id}});  
      }
    },
    "click .delete": function () {
      // TODO: confirm
      // delete the given list
      if (this.ownerId == Meteor.userId()) {
        // TODO: remove from users' favorites
        Lists.remove(this._id);  
      } 
    }
  });

 
  Template.file.helpers({
    "isFavorite": function () {
      // search for file in in user's favorites
      var index = Meteor.user().profile.favoriteFiles.indexOf(this._id);

      // TODO: replace the info css. is there a better way to do this?
      // return a bootstrap class for row highlighting
      return ((index > -1) ? "fa-heart" : "fa-heart-o");
    }
  });


  Template.list.helpers({
    "isFavorite": function () {
      // search for file in in user's favorites
      var index = Meteor.user().profile.favoriteLists.indexOf(this._id);

      // TODO: replace the info css. is there a better way to do this?
      // return a bootstrap class for row highlighting
      return ((index > -1) ? "fa-heart" : "fa-heart-o");
    },
    "isMyList": function () {
      return ((this.ownerId == Meteor.userId())) ? true : false;
    },
    "listCount": function () {
      return this.files.length;
    }
  });


}
