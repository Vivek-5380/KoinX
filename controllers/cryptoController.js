const CryptoData = require('../models/CryptoData');

exports.getLatestStats = async (req, res) => {
    const { coin } = req.query;

    try {
        if (coin) {
            const normalizedCoin = coin.toLowerCase();

            const latestData = await CryptoData.findOne({ 'crypto.crypto': { $regex: new RegExp(`^${normalizedCoin}$`, 'i') } }).sort({ timestamp: -1 });

            if (!latestData) {
                return res.status(404).json({ message: `Cryptocurrency data for '${coin}' not found` });
            }

            res.json({
                coin: latestData.crypto.crypto,
                price: latestData.priceUSD,
                marketCap: latestData.marketCapUSD,
                '24hChange': latestData.change24h,
            });
        } else {

            const latestDataForAllCoins = await CryptoData.aggregate([
                { $sort: { timestamp: -1 } },
                {
                    $group: {
                        _id: "$crypto.crypto",
                        latestData: { $first: "$$ROOT" }
                    }
                }
            ]);

            if (latestDataForAllCoins.length === 0) {
                return res.status(404).json({ message: 'No cryptocurrency data found' });
            }

            const result = latestDataForAllCoins.map(data => ({
                coin: data._id,
                price: data.latestData.priceUSD,
                marketCap: data.latestData.marketCapUSD,
                '24hChange': data.latestData.change24h,
            }));

            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
};