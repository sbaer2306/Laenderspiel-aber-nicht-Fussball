/**
 * Checks if the id passed in is valid (is a number).
 * If the id is invalid, it sends a 400 Bad Request response and returns true.
 * If the id is valid, it returns false.
 * @param {string} id - passed in from the request
 * @param {object} response - response object to send the error response
 * @returns {boolean} - true if the response was sent, false otherwise
 */
function validateId(id, response) {
    if (isNaN(id)) {
        response.status(400).json({ error: 'Invalid ID. Must be a number.' });
        return true;
    }

    return false;
}

module.exports = {
    validateId: validateId
};