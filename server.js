require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');
const { job } = require('./jobs/fetchCryptoDataJob');
const { fetchCryptoData } = require('./jobs/fetchCryptoDataJob');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    fetchCryptoData();

    job.start();
});