///// aldeed:autoform
/* packages
  meteor add mongo
  meteor add accounts-password
  meteor add accounts-ui
  meteor add iron:router
  meteor add fortawesome:fontawesome
  meteor add rubaxa:sortable
*/

//////////// Global stuff? is that right?
Lists = new Mongo.Collection("lists");
Files = new Mongo.Collection("files");


//////////// server stuff
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
    
    user.profile.favoriteFiles = [];
    user.profile.favoriteLists = [];
    return user;
  });
}


//////////// client stuff
if (Meteor.isClient) {
  /*************************
      Routing
  **************************/
  Router.configure({
    layoutTemplate: 'applicationLayout'
  });

  Router.route('/', function () {
    this.render('home');
  });

  Router.route('/lists', function () {
    this.render('listDisplay');
  });

  Router.route('/files', function () {
    this.render('fileDisplay');
  });


  /*************************
      Template Helpers
  **************************/
  Template.applicationLayout.helpers({
    myLists: function () {
      return Lists.find({ownerId: Meteor.userId()}, {sort: {name: 1}});
    }
  });

  Template.listDisplay.helpers({
    myLists: function () {
      return Lists.find({ownerId: Meteor.userId()}, {sort: {name: 1}});
    },
    favoriteLists: function () {
      var favorites = Meteor.user().profile.favoriteLists;
      return Lists.find({$and: [{ownerId: {$ne: Meteor.userId()}}, {_id: {$in: favorites}}]}, {sort: {name: 1}});
    },
    otherLists: function () {
      var favorites = Meteor.user().profile.favoriteLists;
      return Lists.find({$and: [{ownerId: {$ne: Meteor.userId()}}, {_id: {$nin: favorites}}]}, {sort: {name: 1}});
    }
  });

  Template.fileDisplay.helpers({
    myFiles: function () {
      var owner = Meteor.userId();
      return Files.find({ownerId: owner}, {sort: {name: 1}});
    },
    favoriteFiles: function () {
      var owner = Meteor.userId();
      var favorites = Meteor.user().profile.favoriteFiles;
      return Files.find({$and: [{ownerId: {$ne: owner}}, {_id: {$in: favorites}}]}, {sort: {name: 1}});
    },
    otherFiles: function () {
      var owner = Meteor.userId();
      var favorites = Meteor.user().profile.favoriteFiles;
      return Files.find({$and: [{ownerId: {$ne: owner}}, {_id: {$nin: favorites}}]}, {sort: {name: 1}});
    }
  });

  Template.addList.events({
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

  Template.addFile.events({
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
      var index = Meteor.user().profile.favoriteFiles.indexOf(this._id);

      // return a bootstrap class for row highlighting
      // TODO: replace the info css. is this right? setting style in the js?
      return ((index > -1) ? "fa-heart" : "fa-heart-o");
    }
  });


  Template.list.helpers({
    "isFavorite": function () {
      // search for file in in user's favorites
      var index = Meteor.user().profile.favoriteLists.indexOf(this._id);

      // return a bootstrap class for row highlighting
      // TODO: replace the info css. is this right? setting style in the js?
      return ((index > -1) ? "fa-heart" : "fa-heart-o");
    }
  });

}
