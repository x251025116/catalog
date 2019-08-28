'use strict'

const users = require('../controllers/users')
const express=require('express');
const router = express.Router();
router.use('/selectUser', users.selectUser);
router.use('/addUser', users.addUser);
router.use('/updateUser', users.updateUser);
router.use('/deleteUser',users.deleteUser);

module.exports = router;

