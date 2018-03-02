const router = require('express').Router();
const helpers = require('../../helpers');

router.use(helpers.ERROR.SERVER_ERROR);
router.use(helpers.ERROR.PAGE_NOT_FOUND);

module.exports = router;
