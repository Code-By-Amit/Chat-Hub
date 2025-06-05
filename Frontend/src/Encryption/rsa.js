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


// console.log(generateRSAKeys())
// console.log(encryptAESKey("b6033e00ecb479240b72a67a9d89c001e9e5402f96ec8b0b9a2850779473a1a9",'-----BEGIN PUBLIC KEY-----\n' +
//     'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApkiND1EJ9AASk39hn3ZJ\n' +
//     'zy7jPnGtoo3hRH20slDJ+E5APAh2Tj9BYUuxH4JGH3SW+qcGasKC8YQndmTR4Vz9\n' +
//     'jKP3LDRpfRGxaWe0YxWAMP6YyL8kZe1BiaWjnrtvoo89mX8SIwGboQ1jcia+P6Vb\n' +
//     'UCiZaMkt25lBAaseoVqafOHm2EyTF6shyLGppFhopOvJ5sGWyoq7aVgeK4PaBUEa\n' +
//     'w2hhbItp6rc/MJfP3Xk6UpDcLYAzw4ADO40A2cJ2rlvMxXe2d4595k7jpOZmqQ/P\n' +
//     'ut/gipU0lkN5Hx58ehUYxPWKynZamnP8ICHYckHRpd1tNbXl8dv3ASdZTmuIty1v\n' +
//     'dwIDAQAB\n' +
//     '-----END PUBLIC KEY-----'))

//     console.log("----------------------------------------------------------------")
// const encr = "Lc+Dmi92dxUHMTX9li3LlBRJgjAhlwBiZ8e3YGMeFnLSZTAv5PCvEQ9B53zTsbLpdcWN5Vfds2jrhyjsXGYo/byOcHwRBOXYED9dBoM9GBU9EYcMVxWqwqcDlR0gfhEauQWfB7DLrm1rZBYCs5ILp32yHfBx3Pkd2pYxYYPASSZYxo33/E7xDdw3gB9xcNZFCvnEdtEQq5OBc6Y2cD87SsYDBhHgaeAroAkrVvIg6tozAvxeZ99GciAMaWWtE2cRDA+Xir9FaUDzMcORp45Vp7zEeibvwbKg+niGUgCvxgWpA8Bv4Q5oLMox3oX5y05LFuTXxt9XVy1/6twqnqT5fA=="
// const privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
//     'MIIEpQIBAAKCAQEApkiND1EJ9AASk39hn3ZJzy7jPnGtoo3hRH20slDJ+E5APAh2\n' +
//     'Tj9BYUuxH4JGH3SW+qcGasKC8YQndmTR4Vz9jKP3LDRpfRGxaWe0YxWAMP6YyL8k\n' +
//     'Ze1BiaWjnrtvoo89mX8SIwGboQ1jcia+P6VbUCiZaMkt25lBAaseoVqafOHm2EyT\n' +
//     'F6shyLGppFhopOvJ5sGWyoq7aVgeK4PaBUEaw2hhbItp6rc/MJfP3Xk6UpDcLYAz\n' +
//     'w4ADO40A2cJ2rlvMxXe2d4595k7jpOZmqQ/Put/gipU0lkN5Hx58ehUYxPWKynZa\n' +
//     'mnP8ICHYckHRpd1tNbXl8dv3ASdZTmuIty1vdwIDAQABAoIBADb6HclGnefSblHd\n' +
//     '98TlMxoRAokOxL3N8wDWHvwlweEa3hn7IkJUn6UvhWxJgi28On684l5B2VFIxFNc\n' +
//     'mhfMyvfI7lvrKEV1qBaVdwqbfTq1soYMzFf2zYhY/3PnvM0eVtt9K93vFil1Z7/C\n' +
//     'F3yrizlBcxc2DLdiQB/xF7t5XUKUVV3TbEo0B3N4yHgPEXIipN9XHYnXQuOD+7bI\n' +
//     '6gnrvo8IDGfcVq2dKPHDkD3CieCA28FnMVnfbd0yoZaMYkiDAK5+36h5y9v2OadH\n' +
//     'NOA4uSH7zjhitWXHgUB4VUJzbfYrLYqY7qjV0ieBCAuXv0jcAq1XlriioLFTelPv\n' +
//     'paHjJSECgYEA1dWY/M71nAvFHqkSETXleH6ZJjFW2WsixVIB993st3zVUMRLjelQ\n' +
//     'UbAfLs14SSj40WHHXvp9+pM11j++XQ2cZ0Uy9GYPWJ0+K3OaQUfBJci9pDx/reG2\n' +
//     'mAATKlDs03RS0SSavtzoaJCaG7e2qGu55QbG0zFRMoCbJlTb0zzMV5UCgYEAxxKS\n' +
//     'MoyRlhhp987nhd/sqxSOvpBbGUzQFLedkTae0IE9J9Clk8VuyipD9Zeyl239+dm5\n' +
//     'FQtZj1ZXRnhkTxEdDIroM0Ks+4kHY/W9zRuU9/wwUPRsaetD4FFzURaTlxnNWxwR\n' +
//     '2K7jra3VJvVuKFJwJMhPAezm5/5xUCPt1F33t9sCgYEAwUdZCiFzJUIKQWVmnEHQ\n' +
//     'EXK0sS3lp43MFvjCKK3iehOOqHtVI4dg/wUnmmFEOTScen1b/QCDgEsxXV+ujGNy\n' +
//     'HHIS1Y+ujVVLzXCnXBwkfCePKnU4nw2mwotGx3fwKE07Uik46g240FLryOPsaR0+\n' +
//     'IMJYUqqADxrpoeMP80ZAGWUCgYEAgrQBwyih6c9ru+VgA3jrNcRQmHPFLE5PjFqm\n' +
//     'HJKlITbJhVurauNFA31Ok3AfNOdlymaV62hBTCgfM0iWa4dL8FE/dXCAjMICVTIi\n' +
//     'hQln/I3a1zwz9jMepKg1s3bEPoAVYY2DdiYVnJG2klawFc9SjAPsQ9JcJNPdaAW/\n' +
//     'ACEWJOMCgYEAzVc8pd/tkSnfSsSk2VnGLGhuE/pCHw67R1vV3HCPbhhiMAg+98dI\n' +
//     'WaTH44QPyHulAeOekwci2jhAtuSa09abcwKthIAOxsJrKFE64elzWgzal2dFHAwA\n' +
//     'du+PJfb+iH/YRlnT8uThld03ibw8KwkkGbsZ64lbVAVPvSjTotes7TA=\n' +
//     '-----END RSA PRIVATE KEY-----'   
// console.log(decryptAESKey(encr,privateKey))

    