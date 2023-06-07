const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const BIO_MAX_LENGTH = 500;
const LOCATION_MAX_LENGTH = 100;

/**
 * Validates the profile update request body.
 * Constraints:
 * - firstName and lastName, if provided, must be between 2 and 50 characters long
 * - bio, if provided, must be less than 500 characters long
 * - location, if provided, must be less than 100 characters long
 * 
 * @param {Object} profileData to check lengths of
 * @returns {Object|null} - An object containing the error message and the violations array if any violations were found, null otherwise.
 */
function validateProfileUpdate(profileData) {
    const violations = [];

    Object.entries(profileData).forEach(([field, value]) => {
        if (typeof value === 'string') {
            switch (field) {
                case 'firstName':
                case 'lastName':
                    if (value.length < NAME_MIN_LENGTH || value.length > NAME_MAX_LENGTH) {
                        violations.push({ field, minLength: NAME_MIN_LENGTH, maxLength: NAME_MAX_LENGTH, actualLength: value.length });
                    }
                    break;
                case 'bio':
                    if (value.length > BIO_MAX_LENGTH) {
                        violations.push({ field, maxLength: BIO_MAX_LENGTH, actualLength: value.length });
                    }
                    break;
                case 'location':
                    if (value.length > LOCATION_MAX_LENGTH) {
                        violations.push({ field, maxLength: LOCATION_MAX_LENGTH, actualLength: value.length });
                    }
                    break;
                default:
                    break;
            }
        }
    });

    if (violations.length > 0) {
        return {
            error: "Length Limit Violation",
            message: "One or more fields violated the length limit",
            violations: violations
        };
    }
    return null;
}

module.exports = { validateProfileUpdate };