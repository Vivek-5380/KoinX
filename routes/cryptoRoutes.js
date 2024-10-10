const express = require('express');
const { getLatestStats, getDeviation } = require('../controllers/cryptoController');

const router = express.Router();

router.get('/stats', getLatestStats);
router.get('/deviation', getDeviation);

module.exports = router; 
