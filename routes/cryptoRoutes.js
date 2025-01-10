const express = require('express');
const { getLatestStats, getDeviation } = require('../controllers/cryptoController');

const router = express.Router();

router.get('/deviation', getDeviation);
router.get('/stats', getLatestStats);

module.exports = router; 
