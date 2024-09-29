const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth')

router.post('/register', auth.registerAdmin);
router.post('/login', auth.loginAdmin);

module.exports = router;
