const prisma = require('../prisma/prisma');
const prismaClient = prisma.getPrisma();

/**
 * Deletes a user by ID. Since the database cascades everything user related (profile, played games, ...) is deleted too.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object>} - A Promise that resolves when the user is deleted.
 */
const purgeUserData = async (userId) => {
    const parsedId = parseInt(userId);

    const deleteResult = await prismaClient.user.delete({
        where: { id: parsedId },
    });

    return deleteResult;
};

module.exports = { purgeUserData };