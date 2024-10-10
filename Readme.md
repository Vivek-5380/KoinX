# Cryptocurrency Data Fetcher & API

## Introduction

This project is a Node.js application that periodically fetches cryptocurrency data (price in USD, market cap in USD, and 24-hour price change) for Bitcoin, Matic, and Ethereum using the CoinGecko API. It stores the data in a MongoDB **Time-Series Database** and provides API endpoints to retrieve the latest statistics and the standard deviation of cryptocurrency prices over the last 100 records.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Why Time-Series Database?](#why-time-series-database)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [/api/stats](#apistats)
  - [/api/deviation](#apideviation)
- [Cron Job for Data Fetching](#cron-job-for-data-fetching)

---

## Technologies Used

- **Node.js** : Backend JavaScript runtime environment.
- **Express.js** : Web framework for building API endpoints.
- **MongoDB** : A NoSQL database, used as a Time-Series Database to store the fetched cryptocurrency data efficiently.
- **Mongoose** : ODM (Object Data Modeling) library for MongoDB and Node.js.
- **node-cron** : A task scheduler for running background jobs periodically.
- **dotenv** : For environment variable management.

---

## Features

1. **Periodic Data Fetching**: A background job fetches the current price, market cap, and 24-hour price change for Bitcoin, Matic, and Ethereum every two hours.
2. **Time-Series Data**: Stores the fetched data in a MongoDB time-series collection, which is efficient for handling time-dependent data.
3. **API Endpoints**:
   - Get the latest stats for any or all cryptocurrencies.
   - Calculate and return the standard deviation of cryptocurrency prices over the last 100 records.
4. **Error Handling**: Proper error handling for invalid or missing data in both the APIs and background jobs.

---

## Why Time-Series Database?

Time-series databases are designed to handle sequences of data points indexed by timestamps. This makes them ideal for tracking changes over time, such as cryptocurrency prices. MongoDB's time-series collections are particularly efficient for this use case because:

1. **Efficient Storage**: Optimized to store large sequences of time-dependent data.
2. **Automatic Bucketing**: Groups data into buckets based on time, improving query performance.
3. **TTL Indexing**: Automatically expires old data, making it easier to manage storage over time.

In this project, the **timeField** is set to `timestamp`, and metadata (e.g., the cryptocurrency name) is stored in the **metaField**.

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Cluster with Time-Series support
- A free API key from CoinGecko (optional)

### Installation

1. Clone the repository:

```bash
git https://github.com/Vivek-5380/KoinX.git
cd cryptocurrency-data-fetcher-api
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```env
MONGODB_URI=<your_mongodb_uri>
PORT=3000
```

4. Start the server:

```bash
npm start
```

## API Endpoints

### /api/stats

- Method: `GET`
- Description: Get the latest stats for any or all cryptocurrencies.
- Query Parameters:
  - `coin`: Name of the cryptocurrency (e.g., `bitcoin`, `matic`, `ethereum`).
- Response:

```json
{
 price: 40000,
 marketCap: 800000000,
 24hChange: 3.4
}
```

### /api/deviation

- Method: `GET`
- Description: Calculate and return the standard deviation of cryptocurrency prices over the last 100 records.
- Query Parameters:
  - `coin`: Name of the cryptocurrency (e.g., `bitcoin`, `matic`, `ethereum`).
- Response:

```json
{
 deviation: 1000
}
```

## Cron Job for Data Fetching

The project uses a cron job to periodically fetch cryptocurrency data from the CoinGecko API. The job is scheduled to run every two hours and fetch the latest price, market cap, and 24-hour price change for Bitcoin, Matic, and Ethereum.

The fetched data is then stored in the MongoDB time-series collection for further analysis and retrieval.

---