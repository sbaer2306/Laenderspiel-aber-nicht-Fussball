const { fi } = require('@faker-js/faker');
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

/**
 * Retrieves a user by ID.
 *
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<object>} The retrieved user object.
 * @throws {Error} If no user is found for the given ID, an error is thrown. With httpStatusCode 404.
 */
const getUserById = async (id) => {
    const user = await prismaClient.user.findUnique({
        where: { id: id },
    });

    if (!user) {
        const error = new Error('User not found');
        error.httpStatusCode = 404;
        throw error;
    }

    return user;
};

/**
 * Retrieves a user profile by user ID.
 *
 * @param {number} userId - The ID of the user whose profile to retrieve.
 * @returns {Promise<object>} The retrieved profile object.
 * @throws {Error} If no profile is found for the given user ID, an error is thrown.
 *                   If the profile is private, a 403 Forbidden error is thrown. (Response code in error.httpStatusCode)
 */
const getProfileByUserId = async (userId) => {
    const profile = await prismaClient.profile.findUnique({
        where: { userId: userId },
    });

    if (!profile) {
        const error = new Error('Profile not found - the user exists but has no profile.');
        error.httpStatusCode = 404;
        throw error;
    }

    return profile;
};
const getUserByOAuthID = async (OAuthID) => {
    const user = await prismaClient.user.findUnique({
        where: { OAuthID: OAuthID },
    });
    return user;
};
const createUser = async (newUser) => {
    const user = await prismaClient.user.create({ data: {
        email: newUser.email,
        OAuthID: newUser.OAuthID,
        username: newUser.username
      } });
    // create profile for user
    // split username into first and last name
    // half of the username is the first name, the other half is the last name
    const username = user.username;
    const firstName = username.substring(0, username.length / 2);
    const lastName = username.substring(username.length / 2, username.length);

    await prismaClient.profile.create({
        data: {
            userId: user.id,
            isPrivate: false,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            location: newUser.location
        }
    });

    // create all time scoring
    await prismaClient.allTimeRanking.create({
        data: {
            userId: user.id,
            score: 0
        }
    });

    return user;
};


module.exports = { purgeUserData, getUserById, getProfileByUserId, getUserByOAuthID, createUser };