import forge from 'node-forge';
import CryptoJS from 'crypto-js';

export const generateRSAKeys = () => {
    const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);
    const publicPem = forge.pki.publicKeyToPem(publicKey);
    const privatePem = forge.pki.privateKeyToPem(privateKey);
    return { publicKey: publicPem, privateKey: privatePem };
};

export const encryptPrivateKey = (privateKey, password) => {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
};

export const decryptPrivateKey = (encryptedPrivateKey, password) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed", error);
        return null;
    }
};

export const encryptAESKey = (aesKey, publicKey) => {
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = publicKeyObj.encrypt(aesKey, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
};

export const decryptAESKey = (encryptedAESKey, privateKey) => {
    const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
    const encryptedBytes = forge.util.decode64(encryptedAESKey);
    const decrypted = privateKeyObj.decrypt(encryptedBytes, 'RSA-OAEP');
    return decrypted;
};

