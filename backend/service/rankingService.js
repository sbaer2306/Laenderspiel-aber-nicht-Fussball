const { getPrisma } = require('../prisma/prisma');

const RANKING_AMOUNT = 10; // Top 10 Users
const prismaClient = getPrisma();

/**
 * Retrieves the top 10 users from the AllTimeRanking.
 *
 * @returns {Promise<Object[]>} - The top 10 users from the AllTimeRanking.
 */
const getAllTimeRanking = async () => {

    const allTimeRanking = await prismaClient.allTimeRanking.findMany({
        orderBy: { score: 'desc' },
        take: RANKING_AMOUNT,
        include: {
            user: {
                select: { id: true, username: true }
            }
        }
    });
    const response = {
        message: "Top 10 users retrieved successfully.",
        data: allTimeRanking.map(rank => {
            return {
                id: rank.id,
                score: rank.score,
                lastUpdated: rank.lastUpdated,
                username: rank.user.username,
                user_id: rank.user.id
            };
        })
    };

    return response;
};

/**
 * Retrieves the top 10 users from the MonthlyRanking for a given month and year.
 *
 * @param {string} month - The month as a string.
 * @param {string} year - The year as a string.
 * @returns {Promise<Object>} - The response object containing the top 10 users from the MonthlyRanking for the given month and year.
 */
const getMonthlyRanking = async (month, year) => {
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    if (isNaN(parsedMonth) || isNaN(parsedYear)) {
        throw new Error('Month and year must be numbers');
    }

    const monthlyRanking = await prismaClient.monthlyRanking.findMany({
        where: { month: parsedMonth, year: parsedYear },
        orderBy: { score: 'desc' },
        take: RANKING_AMOUNT,
        include: {
            user: {
                select: { id: true, username: true }
            }
        }
    });

    const response = {
        message: "Top 10 users retrieved successfully for given month and year.",
        month: parsedMonth,
        year: parsedYear,
        data: monthlyRanking.map(rank => {
            return {
                id: rank.id,
                score: rank.score,
                lastUpdated: rank.lastUpdated,
                username: rank.user.username,
                user_id: rank.user.id
            };
        })
    };

    return response;
};

module.exports = { getAllTimeRanking, getMonthlyRanking };