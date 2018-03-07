const router = require('express').Router();
const { Confirm } = require('../controllers');

router.get('/confirm', Confirm.RENDER_CONFIRM);

router.get('/confirm/resend', Confirm.RENDER_RESEND);

router.post('/confirm/resend', Confirm.RESEND_CONFIRM);

router.get('/confirm/token/:token', Confirm.CONFIRM_TOKEN);

module.exports = router;
