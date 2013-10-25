/*
 * Session Routes
 */

var users = require('../data/users');

module.exports = function(app) {

  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    }
  });

  app.get('/session/new', function(req, res) {
    res.render('session/new', {title: "Log in"});
  });

  app.post('/session', function(req, res) {
    if (users[req.body.username] && 
      users[req.body.username].password === req.body.password) {
        req.session.user = users[req.body.username];
        res.redirect('/users');
      } else {
        res.redirect('/session/new')
      }
  });

  app.del('/session', function(req, res, next) {
    req.session.destroy();
    res.redirect('/users');
  });

};