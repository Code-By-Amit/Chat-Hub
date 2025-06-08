import CryptoJS from 'crypto-js'

export const generateAESKey = () => {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
};

export const encryptMessage = (message, aesKey) => {
    return CryptoJS.AES.encrypt(message, aesKey).toString();
};

export const decryptMessage = (encryptedMessage, aesKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, aesKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

