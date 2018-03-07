const router = require('express').Router();
const { Resource } = require('../controllers');

router.post('/resource', Resource.CREATE_RESOURCE);

module.exports = router;
