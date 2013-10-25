function errorCreator() {
  return function(req, res, next) {
    next(new Error('This is an error'));
  };
}

module.exports = errorCreator;