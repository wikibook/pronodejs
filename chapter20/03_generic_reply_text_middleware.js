function replyText(text) {
  return function(req, res) {
    res.end(text);
  };
}

module.exports = replyText;