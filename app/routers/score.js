const express=require('express');
const router = express.Router();
const score = require('../controllers/score');

router.use('/select',score.selectScore);

module.exports = router;
