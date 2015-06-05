if (Meteor.isClient) {
  /*************************
      Routing (/lib/router.js)
  **************************/
  Router.configure({
    layoutTemplate: 'applicationLayout'
  });

  // top level routes
  Router.route('/', function () {
    this.render('home', {to: 'topYield'});
    this.render('', {to: 'bottomYield'}); // TODO: is there a better way to do this? clearing a yield?
  });

  Router.route('list', function () {
    this.render('listDisplay', {to: 'topYield'});
    this.render('newList', {to: 'bottomYield'});
  });

  Router.route('file', function () {
    this.render('fileDisplay', {to: 'topYield'});
    this.render('newFile', {to: 'bottomYield'});
  });

  // sub routes
  Router.route('/list/:_id', function () {
      // get parameter via this.params
      this.render('', {to: 'bottomYield'});
      this.render('listDetail', {
        to: 'topYield',
        data: function() {
          return Lists.findOne(this.params._id);
        }
      });
  });
}
