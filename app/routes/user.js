const express = require('express');
const userCtrl = require('../controllers/user');
const ensureAuth = require('../../helpers/auth').ENSURE_AUTH;

const router = express.Router();

// router.use(ensureAuth);

router.get('/', userCtrl.FETCH_USER);

/*TODO: Add Change Password Feature*/
// router.post('/password', userCtrl.CHANGE_PASSWORD);
router.post('/info', userCtrl.CHANGE_INFO);

module.exports = router;
