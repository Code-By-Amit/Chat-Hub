import { get, set, del } from 'idb-keyval';

// Save decrypted private key
export const storePrivateKey = (key) => set('privateKey', key);

// Get it back on app start
export const getStoredPrivateKey = () => get('privateKey');

// Clear on logout
export const clearStoredPrivateKey = () => del('privateKey');
