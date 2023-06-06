const gameHistoryService = require('../service/playedGamesService');
const { getPrisma } = require('../prisma/prisma');

/**
 * Retrieves the played games for a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const getPlayedGames = async (req, res) => {
    const { id } = req.params;
    const { page, pageSize } = req.query;
    const prismaClient = getPrisma();

    // TODO: auth middleware! + authorization (uswer owns profile --> deliver despite private)
    try {
        const parsedId = parseInt(id);
        const user = await prismaClient.user.findUnique({
            where: { id: parsedId },
            include: { Profile: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // user profile may be undefined --> treat as private
        if (!user.Profile || !user.Profile.isPrivate) {
            return res.status(403).json({ message: 'Unauthorized - the profile is set to private, therefore the game history is private too.' });
        }

        const playedGamesData = await gameHistoryService.getPlayedGamesByUser(id, page, pageSize);

        res.status(200).json(playedGamesData);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Deletes the played games for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process. --> sends 500 Internal error
 */
const deleteAllPlayedGames = async (req, res) => {
    const { id } = req.params;
    const prismaClient = getPrisma();

    // TODO: auth middleware! (user allowed to delete this history)
    try {
        const parsedId = parseInt(id);
        const user = await prismaClient.user.findUnique({ where: { id: parsedId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletionResult = await gameHistoryService.deletePlayedGamesByUser(id);

        res.status(200).json(deletionResult);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getPlayedGames, deleteAllPlayedGames };