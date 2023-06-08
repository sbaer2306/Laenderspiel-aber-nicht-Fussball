const profileService = require('../service/profileService');
const { validateProfileUpdate } = require('../helpers/profileHelpers');
const { validateId } = require('../helpers/invalidIDhelper');

/**
 * Retrieves a user profile by id.
 * 
 * @param {Object} req - The request object. The id parameter is expected in the request parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process.
 */
const getProfile = async (req, res) => {

    const { id } = req.params;

    validateId(id, res);

    try {
        const profile = await profileService.getProfile(parseInt(id));

        // TODO: Authorization - check if profile is private and user is not owner
        if (profile.isPrivate) {
            let error = new Error('Unauthorized - user profile is private');
            error.httpStatusCode = 403;
            throw error;
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error.httpStatusCode, error.message);
        if (error.httpStatusCode === 404) {
            res.status(error.httpStatusCode).json({ message: error.message });
        }
        else if (error.httpStatusCode === 403) {
            res.status(error.httpStatusCode).json({ message: error.message });
        }
        else {
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

    validateId(id, res);

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

/**
 * Creates a new user profile for the currently authenticated user.
 * Checks if the user already has a profile (conflict).
 * Validates the request body. (see helpers/profileHelpers.js for validation rules) and updateProfile(). (analogue to updateProfile())
 * 
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
const createProfile = (req, res) => {
    //profileService.createProfile(req.body);
    // Implementiere hier die Logik zum Erstellen eines Profils
    res.status(201).json({ message: 'TODO: Profil abhängig von authentifiziertem User erstellen!' });
};

module.exports = { getProfile, updateProfile, createProfile };