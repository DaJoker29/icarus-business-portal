const router = require('express').Router();
const { Auth } = require('../../helpers');
const { Ticket } = require('../controllers');

router.get('/tickets', Auth.AUTHENTICATED, Ticket.RENDER_TICKETING);

router.post('/tickets', Auth.AUTHENTICATED, Ticket.SUBMIT_TICKET);

module.exports = router;
