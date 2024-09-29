const express = require('express');
const router = express.Router();
const history = require('../controllers/history')

router.get('/get_history', history.getHistory);

module.exports = router;
