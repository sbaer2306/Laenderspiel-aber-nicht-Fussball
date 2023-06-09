const db = require('../prisma/prisma');
const prisma = db.getPrisma();
const crypto = require('crypto');

/**
 * Retrieves the user statistics based on the provided user ID and ETag.
 * @param {number|string} userId - The ID of the user. Will be parsed to a number.
 * @param {string} etag - The ETag value received from the client.
 * @returns {Promise<{newEtag: string, stats: object}>} - A promise that resolves to an object containing the new ETag and the user statistics.
 */
exports.getUserStats = async (userId, etag) => {
    let parsedUserId = parseInt(userId);

    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        include: {
            AllTimeRanking: true, PlayedGame: { include: { country: true } }
        },
    });

    // if the score hasn't changed, there is no need to send the stats again
    const score = user.AllTimeRanking.score.toString();
    let newETagValue = score + user.AllTimeRanking.id;
    const newEtag = crypto.createHash('sha1').update(newETagValue).digest('hex');

    if (etag === newEtag) return 304;

    const stats = await assembleStats(user);

    return { newEtag, stats };
};


/**
 * Assembles statistics based on the user's played games data.
 * @param {object} user - The user object containing the played games data.
 * @returns {Promise<void>} - The statistics result object.
 */
const assembleStats = async (user) => {
    const { PlayedGame, AllTimeRanking } = user;

    const gamesPerCountry = PlayedGame.reduce((map, game) => {
        const { country, score, gameDuration } = game;

        const countryName = country ? country.name : 'Unknown';

        if (!map[country.id]) {
            map[country.id] = {
                Amount: 0,
                TotalScore: 0,
                TotalTime: 0,
                Country: countryName, // Include the country name
            };
        }
        map[country.id].Amount += 1;
        map[country.id].TotalScore += score;
        map[country.id].TotalTime += gameDuration;
        return map;
    }, {});

    const countriesRes = Object.entries(gamesPerCountry).map(([countryId, stats]) => {
        const averageScore = stats.TotalScore / stats.Amount;
        const averageTime = stats.TotalTime / stats.Amount;
        return {
            CountryId: Number(countryId),
            CountryName: stats.Country,
            Amount: stats.Amount,
            AverageScore: averageScore,
            AverageTime: averageTime,
        };
    });

    const sortedCountriesResult = countriesRes.sort((a, b) => b.Amount - a.Amount);

    const totalTimePlayed = PlayedGame.reduce((total, game) => total + game.gameDuration, 0);

    let fastestGame = PlayedGame.reduce((min, game) => (game.gameDuration < min.gameDuration ? game : min), PlayedGame[0]);

    let slowestGame = PlayedGame.reduce((max, game) => (game.gameDuration > max.gameDuration ? game : max), PlayedGame[0]);

    // check if slowest of fastest game is undefined --> empty object
    if (fastestGame === undefined) {
        fastestGame = null;
    }
    if (slowestGame === undefined) {
        slowestGame = null;
    }


    const statsResult = {
        TotalGamesPlayed: PlayedGame.length,
        TotalTimePlayed: totalTimePlayed,
        FastestGame: fastestGame,
        SlowestGame: slowestGame,
        Ranking: AllTimeRanking,
        CountryGameSummary: sortedCountriesResult,
    };

    return statsResult;
};