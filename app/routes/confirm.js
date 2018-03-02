const router = require('express').Router();
const controllers = require('../controllers');

router.get('/confirm', controllers.CONFIRM.RENDER_CONFIRM);

router.get('/confirm/resend', controllers.CONFIRM.RENDER_RESEND);

router.post('/confirm/resend', controllers.CONFIRM.RESEND_CONFIRM);

router.get('/confirm/token/:token', controllers.CONFIRM.CONFIRM_TOKEN);

module.exports = router;
