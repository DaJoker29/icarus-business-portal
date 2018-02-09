const express = require('express');

const router = express.Router();

router.use(errorHandler);
router.use(notFoundHandler);

function notFoundHandler(req, res, next) {
  res.status(404).send("Can't find that page");
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}

module.exports = router;
