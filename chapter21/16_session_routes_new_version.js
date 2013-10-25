/*
 * Session Routes
 */

var users = require('../data/users');
var notLoggedIn = require('./middleware/not_logged_in');

module.exports = function(app) {

  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    }
  });

  app.get('/session/new', notLoggedIn, function(req, res) {
    res.render('session/new', {title: "Log in"});
  });

  app.post('/session', notLoggedIn, function(req, res) {
    if (users[req.body.username] &&
      users[req.body.username].password === req.body.password) {
        req.session.user = users[req.body.username];
        res.redirect('/users');
      } else {
        res.redirect('/session/new');
      }
    });

  app.del('/session', function(req, res, next) {
    req.session.destroy();
    res.redirect('/users');
  });

};