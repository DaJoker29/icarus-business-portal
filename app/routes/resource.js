const router = require('express').Router();
const controllers = require('../controllers');

router.post('/resource', controllers.RESOURCE.CREATE_RESOURCE);

module.exports = router;
