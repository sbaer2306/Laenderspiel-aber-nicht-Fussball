const rankingService = require('../service/rankingService');

/**
 * Retrieves the all time ranking of users.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const getAllTimeRanking = async (req, res) => {
    try {
        const ranking = await rankingService.getAllTimeRanking();
        res.status(200).json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Retrieves the monthly ranking of users for a given month and year.
 * 
 * @param {Object} req - The request object. The month and year parameters are expected in the request parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const getMonthlyRanking = async (req, res) => {
    const { month, year } = req.params;

    try {
        if (isNaN(month) || isNaN(year) || parseInt(month) > 12 || parseInt(month) < 0) {
            return res.status(400).json({ message: 'Invalid request. Month and year must be valid numbers.' });
        }
        const parsedMonth = parseInt(month);
        const parsedYear = parseInt(year);

        const ranking = await rankingService.getMonthlyRanking(parsedMonth, parsedYear);
        res.status(200).json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAllTimeRanking, getMonthlyRanking };
