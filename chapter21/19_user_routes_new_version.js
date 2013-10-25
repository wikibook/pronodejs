/*
 * User Routes
 */

var users = require('../data/users');
var notLoggedIn = require('./middleware/not_logged_in');
var loadUser = require('./middleware/load_user');

module.exports = function(app) {

  app.get('/users', function(req, res){
    res.render('users/index', {title: 'Users', users: users});
  });

  app.get('/users/new', notLoggedIn, function(req, res) {
    res.render('users/new', {title: "New User"});
  });

  app.get('/users/:name', loadUser, function(req, res, next){
    res.render('users/profile', {title: 'User profile', user: req.user});
  });

  app.post('/users', notLoggedIn, function(req, res) {
    if (users[req.body.username]) {
      res.send('Conflict', 409);
    } else {
      users[req.body.username] = req.body;
      res.redirect('/users');
    }
  });

  app.del('/users/:name', loadUser, function(req, res, next) {
    delete users[req.user.username];
    res.redirect('/users');
  });

};