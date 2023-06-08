const statsService = require('../service/statsService');
const userService = require('../service/userService');
const { validateId } = require('../helpers/invalidIDhelper');
/**
 * Get user statistics based on the provided user ID.
 * ETag is used for caching. If the ETag value matches the one on the server, the server will return 304.
 * If the ETag value does not match, the server will return the new ETag and the statistics.
 * If the user is not found, the server will return 404.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
exports.getUserStats = async (req, res) => {
    try {
        // TODO: Authorization --> only the user itself should be able to access the stats

        if (validateId(id, res)) return;

        const id = parseInt(req.params.id);
        const user = await userService.getUserById(id); // throws 404 if user not found

        const etag = req.headers['if-none-match'];
        const result = await statsService.getUserStats(id, etag);

        if (result === 304) {
            res.status(304).end();
        } else if (result === 404) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.set('ETag', result.newEtag);
            res.json(result.stats);
        }
    } catch (error) {
        if (error.httpStatusCode) {
            res.status(error.httpStatusCode).json({ error: error.message });
            return;
        }

        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};