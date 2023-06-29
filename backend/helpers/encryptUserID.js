const crypto = require('crypto');

function encryptUserID(userID){
    const algorithm = 'aes-256-ctr';
    const encryptionKey = 'zeugenSeehofers';
    const cipher = crypto.createCipher(algorithm, encryptionKey);
    let enpryptedUserID = cipher.update(String(userID), 'utf8', 'hex');

    return enpryptedUserID;
}

module.exports = { encryptUserID };