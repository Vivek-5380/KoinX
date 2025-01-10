module.exports = function calculateStandardDeviation(prices) {
    const mean = prices.reduce((acc, p) => acc + p, 0) / prices.length;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance).toFixed(5);
};
