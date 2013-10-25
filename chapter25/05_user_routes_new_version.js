/*
 * User Routes
 */

var User = require('../data/models/user');
var notLoggedIn = require('./middleware/not_logged_in');
var loadUser = require('./middleware/load_user');
var restrictUserToSelf = require('./middleware/restrict_user_to_self');


module.exports = function(app) {

  app.get('/users', function(req, res,next){
    User.find({}, function(err, users) {
      if (err) {
        return next(err);
      }
      res.render('users/index', {title: 'Users', users: users});
    });
  });

  app.get('/users/new', notLoggedIn, function(req, res) {
    res.render('users/new', {title: "New User"});
  });

  app.get('/users/:name', loadUser, function(req, res, next){
    res.render('users/profile', {title: 'User profile', user: req.user});
  });

  app.post('/users', notLoggedIn, function(req, res, next) {
    User.findOne({username: req.body.username}, function(err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        return res.send('Conflict', 409);
      }
      User.create(req.body, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/users');
      });
    });
  });

  app.del('/users/:name', loadUser, restrictUserToSelf,
    function(req, res, next) {
      req.user.remove(function(err) {
        if (err) { return next(err); }
        res.redirect('/users');
      });
    
  });

};