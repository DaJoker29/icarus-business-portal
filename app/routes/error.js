const express = require('express');
const pageNotFound = require('../../helpers/error').PAGE_NOT_FOUND;
const serverError = require('../../helpers/error').SERVER_ERROR;

const router = express.Router();

router.use(serverError);
router.use(pageNotFound);

module.exports = router;
