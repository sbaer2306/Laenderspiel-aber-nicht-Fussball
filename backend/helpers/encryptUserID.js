const crypto = require('crypto');

/**
 * Encrypts the provided user ID using AES-256 encryption.
 * 
 * @param {number} userID - The user ID to be encrypted.
 * @returns {string} - The encrypted user ID.
 */
function encryptUserID(userID){
    const algorithm = 'aes-256-ctr';
    const encryptionKey = 'zeugenSeehofers';

    
    const cipher = crypto.createCipher(algorithm, encryptionKey);
    let enpryptedUserID = cipher.update(String(userID), 'utf8', 'hex');

    return enpryptedUserID;
}

module.exports = { encryptUserID };