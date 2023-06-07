const { getPrisma } = require('../prisma/prisma');
const prisma = getPrisma();

/**
 * Retrieves a user profile by ID.
 *
 * @param {number} id - The ID of the profile to retrieve.
 * @returns {Promise<object>} The retrieved profile object.
 * @throws {Error} If no profile is found for the given ID, an error is thrown.
 */

getProfile = async (id) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { id },
        });
        if (!profile) {
            const error = new Error('Profile not found');
            error.httpStatusCode = 404;
            throw error;
        }
        return profile;
    } catch (error) {
        console.error(`Failed to get profile: ${error}`);
        throw error;
    }
};

/**
 * Updates a user profile.
 *
 * @param {number} id - The ID of the profile to update.
 * @param {object} updateData - The data to update the profile with.
 * @returns {Promise<object>} The updated profile object.
 * @throws {Error} If the profile is not found, an error with a 404 HTTP status code is thrown.
 */
updateProfile = async (id, updateData) => {
    const profile = await prisma.profile.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    if (!profile) {
        const error = new Error('Profile not found');
        error.httpStatusCode = 404;
        throw error;
    }

    const updatedProfile = await prisma.profile.update({
        where: {
            id: parseInt(id),
        },
        data: updateData,
    });

    return updatedProfile;
};

module.exports = { getProfile, updateProfile };