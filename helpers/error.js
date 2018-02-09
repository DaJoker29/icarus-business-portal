function pageNotFound(req, res, next) {
  res.status(404).send("Can't find that page");
}

function serverError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}

module.exports.PAGE_NOT_FOUND = pageNotFound;
module.exports.SERVER_ERROR = serverError;
