const router = require('express').Router();
const helpers = require('../../helpers');

router.use(helpers.ERROR.PAGE_NOT_FOUND);
router.use(helpers.ERROR.SERVER_ERROR);

module.exports = router;
