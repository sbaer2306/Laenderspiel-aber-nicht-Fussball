const profileService = require('../service/profileService');
const { validateProfileUpdate } = require('../helpers/profileHelpers');


/**
 * Retrieves a user profile by id.
 * 
 * @param {Object} req - The request object. The id parameter is expected in the request parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const getProfile = async (req, res) => {

    // TODO: Authorization --> isPrivate

    const { id } = req.params;

    try {
        const profile = await profileService.getProfile(parseInt(id));
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        if (error.httpStatusCode === 404) {
            res.status(404).json({ message: 'Profile Not Found' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

/**
 * Updates a user profile by id.
 * 
 * @param {Object} req - The request object. The id parameter is expected in the request parameters and the updated profile data in the request body.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const updateProfile = async (req, res) => {
    const { id } = req.params;

    // TODO: Authorization

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Empty Request Body",
            message: "Invalid request. Request body is empty."
        });
    }

    const allowedFields = ["firstName", "lastName", "bio", "location", "isPrivate"];
    const bodyFields = Object.keys(req.body);
    const invalidFields = bodyFields.filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: "Invalid Field(s)",
            message: `Invalid request. Request body contains invalid field(s): ${invalidFields.join(', ')}.`
        });
    }

    const validationResult = validateProfileUpdate(req.body);
    if (validationResult) {
        return res.status(400).json(validationResult);
    }

    try {
        const profile = await profileService.updateProfile(parseInt(id), req.body);
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        if (error.httpStatusCode === 404) {
            res.status(404).json({ message: 'Profile Not Found' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = { getProfile, updateProfile };