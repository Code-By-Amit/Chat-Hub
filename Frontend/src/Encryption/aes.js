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

// // console.log(encryptMessage('hello i am good what about you aaaaaaaaaaaaa', "b6033e00ecb479240b72a67a9d89c001e9e5402f96ec8b0b9a2850779473a1a9"))
// console.log(decryptMessage("U2FsdGVkX1+P94sgzWoNYzQxERKicBtifgpT3BbaJU1SrmRikBd2fKTrYmwo6h9h6U9BHAKOy8AVKr1U1ZR9ZA==","b6033e00ecb479240b72a67a9d89c001e9e5402f96ec8b0b9a2850779473a1a9"))
// console.log(decryptMessage("U2FsdGVkXd1+izefp+lrsbrb1Sa+WKAdAisjr/nXliuk8eYBarPwmNkXt91+6aJeAS11ltPIRDfRJVyDLwTzXlQ==","b6033e00ecb479240b72a67a9d89c001e9e5402f96ec8b0b9a2850779473a1a9"))