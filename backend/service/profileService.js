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
 * Creates a profile for the specified user_id.
 *
 * @param {number} user_id - The ID of the user that creates the profile.
 * @returns {Promise<object>} The retrieved profile object.
 * @throws {Error} If insertion fails, an error is thrown.
 */

createNewProfile = async (user_id, profile_data) => {

    // check if the user already has a profile
    const existingProfile = await prisma.profile.findUnique({
        where: {
            userId: user_id,
        },
    });
    if (existingProfile) {
        const error = new Error('User already has a profile.');
        error.httpStatusCode = 409;
        throw error;
    }

    const profile = await prisma.profile.create({
        data: {
            userId: user_id,
            firstName: profile_data.firstName,
            lastName: profile_data.lastName,
            bio: profile_data.bio,
            location: profile_data.location,
            isPrivate: profile_data.isPrivate,
        },
    });
    if (!profile) {
        const error = new Error('Profile creation failed.');
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

module.exports = { getProfile, updateProfile, createNewProfile };