const CryptoData = require('../models/CryptoData');
const calculateStandardDeviation = require('../utils/calculateStandardDeviation');

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


exports.getDeviation = async (req, res) => {
    const { coin } = req.query;

    try {
        if (coin) {
            const normalizedCoin = coin.toLowerCase();

            const prices = await CryptoData.find({ 'crypto.crypto': { $regex: new RegExp(`^${normalizedCoin}$`, 'i') } })
                .sort({ timestamp: -1 })
                .limit(100)
                .select('crypto.crypto priceUSD -_id');

            if (prices.length === 0) {
                return res.status(404).json({ message: `No data found for the requested cryptocurrency '${coin}'` });
            }

            const originalCoinName = prices[0]?.crypto?.crypto;

            const priceValues = prices.map(p => p.priceUSD);
            const deviation = calculateStandardDeviation(priceValues);

            return res.json({
                coin: originalCoinName,
                deviation,
            });
        } else {
            const allCoins = await CryptoData.aggregate([
                { $sort: { timestamp: -1 } },
                {
                    $group: {
                        _id: "$crypto.crypto",
                        prices: { $push: "$priceUSD" },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        prices: { $slice: ["$prices", 100] }
                    }
                }
            ]);

            if (allCoins.length === 0) {
                return res.status(404).json({ message: 'No cryptocurrency data found' });
            }

            const result = allCoins.map(coinData => {
                const deviation = calculateStandardDeviation(coinData.prices);
                
                return {
                    coin: coinData._id,
                    deviation,
                };
            });

            return res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error calculating deviation', error });
    }
};
