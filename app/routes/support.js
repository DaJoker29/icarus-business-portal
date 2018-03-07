const router = require('express').Router();
const { Auth } = require('../../helpers');
const { Support } = require('../controllers');

router.get('/support', Auth.AUTHENTICATED, Support.RENDER_SUPPORT);

router.post('/support', Auth.AUTHENTICATED, Support.SUBMIT_MESSAGE);

module.exports = router;
