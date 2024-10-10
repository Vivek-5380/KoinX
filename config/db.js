const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        const db = mongoose.connection.db;
        const collections = await db.listCollections({ name: 'crypto_prices' }).toArray();

        if (collections.length === 0) {
            await db.createCollection('crypto_prices', {
                timeseries: {
                    timeField: 'timestamp',
                    metaField: 'crypto',
                    granularity: 'hours',
                },
                expireAfterSeconds: 31536000
            });
            console.log('Time-series collection created');
        }

    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
