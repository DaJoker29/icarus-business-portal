const router = require('express').Router();
const { Error: ErrHelper } = require('../../helpers');

router.use(ErrHelper.PAGE_NOT_FOUND);
router.use(ErrHelper.SERVER_ERROR);

module.exports = router;
