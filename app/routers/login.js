const express = require('express');
const router = express.Router();
const login = require('../controllers/login');

router.use('/verLogin',login.verLogin);
router.use('/exit',login.exit);

module.exports = router;