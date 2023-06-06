const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();
const userService = require('../service/userService')

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

    // TODO: auth middleware! (user allowed to delete themselves)
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

module.exports = { deleteUser };