/**
 * Checks if the id passed in is valid (is a number).
 * If the id is invalid, it sends a 400 Bad Request response.
 * @param {string} id - passed in from the request
 * @param {object} response - response object to send the error response
 * @returns {void}
 */
function validateId(id, response) {
    if (isNaN(id)) {
        response.status(400).json({ error: 'Invalid ID. Must be a number.' });
    }
}

module.exports = {
    validateId: validateId
};