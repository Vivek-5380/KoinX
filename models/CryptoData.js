const mongoose = require('mongoose');

const CryptoData = mongoose.model('CryptoData', 
    new mongoose.Schema({}, 
        { strict: false }
    ), 'crypto_prices');

module.exports = CryptoData;
