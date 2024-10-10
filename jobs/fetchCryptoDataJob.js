const cron = require('node-cron');
const axios = require('axios');
const CryptoData = require('../models/CryptoData');

const fetchCryptoData = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,matic-network,ethereum',
                vs_currencies: 'usd',
                include_market_cap: 'true',
                include_24hr_change: 'true'
            }
        });

        const { bitcoin, 'matic-network': matic, ethereum } = response.data;

        const cryptoData = [
            { crypto: { crypto: 'Bitcoin' }, priceUSD: bitcoin.usd, marketCapUSD: bitcoin.usd_market_cap, change24h: bitcoin.usd_24h_change, timestamp: new Date() },
            { crypto: { crypto: 'Matic' }, priceUSD: matic.usd, marketCapUSD: matic.usd_market_cap, change24h: matic.usd_24h_change, timestamp: new Date() },
            { crypto: { crypto: 'Ethereum' }, priceUSD: ethereum.usd, marketCapUSD: ethereum.usd_market_cap, change24h: ethereum.usd_24h_change, timestamp: new Date() }
        ];

        await CryptoData.insertMany(cryptoData);
        console.log('Crypto data fetched and stored successfully!');
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
};

const job = cron.schedule('*/2 * * * *', fetchCryptoData);

module.exports = {
    fetchCryptoData,
    job
};
