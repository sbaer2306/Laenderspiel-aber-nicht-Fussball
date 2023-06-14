const { validateId } = require('../helpers/invalidIDhelper');
const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();
const userService = require('../service/userService')

const createUser = async (req, res) => {
    const { email, username, OAuthID } = req.body;

    if (!email || !username || !OAuthID) {
        return res.status(400).json({ error: 'Missing required fields: email, username, and OAuthID.' });
    }

    //TODO Datenbankstuff
    const id = 1;

    return id;

}

const checkUserExists = async (OAuthID) => {
    /* TODO
    const user = await db.users.findOne({ OAuthID });

    return user !== null;*/
    return false;
}

/**
 * Deletes a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (validateId(id, res)) return;

    if (id != req.user.id) {
        res.status(403).json({ message: 'Unauthorized.' });
    }

    try {
        const parsedId = parseInt(id);
        const user = await prismaClient.user.findUnique({ where: { id: parsedId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userService.purgeUserData(id);

        res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Retrieves a user profile by user ID.
 *
 * @param {Request} req - The request object containing parameters.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 */
const getProfileByUserId = async (req, res) => {
    const { id } = req.params;

    if (validateId(id, res)) return;

    try {
        const user = await userService.getUserById(parseInt(id));

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const profile = await userService.getProfileByUserId(parseInt(id));


        if (profile.isPrivate && profile.userId !== req.user.id) {
            const error = new Error('Forbidden - Profile is private');
            error.httpStatusCode = 403;
            throw error;
        }

        res.status(200).json(profile);
    } catch (error) {
        if (error.httpStatusCode) {
            return res.status(error.httpStatusCode).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

module.exports = { deleteUser, getProfileByUserId, checkUserExists, createUser };