const router = require('express').Router();
const { Confirm, Auth } = require('../controllers');

router.get('/confirm', Confirm.RENDER_CONFIRM);
router.post('/confirm', Confirm.RESEND_CONFIRM);

router.get('/confirm/:token', Auth.RENDER_PASSWORD);
router.post('/confirm/:token', Auth.CONFIRM_PASSWORD, Auth.CREATE_PASSWORD);

module.exports = router;
