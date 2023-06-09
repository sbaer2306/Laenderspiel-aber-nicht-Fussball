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
    const profile = await prisma.profile.findUnique({
        where: { id },
    });
    if (!profile) {
        const error = new Error('Profile not found');
        error.httpStatusCode = 404;
        throw error;
    }
    return profile;

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

    // set updatedAt to current timestamp
    updateData.updatedAt = new Date();

    const { firstName, lastName, bio, location } = updateData;
    if (firstName) {
        updateData.firstName = firstName.trim();
    }
    if (lastName) {
        updateData.lastName = lastName.trim();
    }
    if (bio) {
        updateData.bio = bio.trim();
    }
    if (location) {
        updateData.location = location.trim();
    }

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

/**
 * Creates a user profile.
 * @param {Object} profileData firstName, lastName, bio, location, isPrivate, userId
 * @returns {Promise<Object>} The created profile object.
 */
const createProfile = async (profileData) => {
    const profile = await prisma.profile.create({
        data: profileData,
    });
    return profile;
};

module.exports = { getProfile, updateProfile, createProfile };