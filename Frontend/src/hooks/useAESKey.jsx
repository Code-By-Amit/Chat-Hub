import { useState, useEffect, useCallback } from "react";
import { generateAESKey } from "../Encryption/aes";

export const useAESKey = (enabled = true) => {
    const [aesKey, setAESKey] = useState(null);

    useEffect(() => {
        if (enabled && !aesKey) {
            const key = generateAESKey();
            setAESKey(key);
        }
    }, [enabled, aesKey]);

    const regenerateKey = useCallback(() => {
        const newKey = generateAESKey();
        setAESKey(newKey);
    }, []);

    const clearKey = useCallback(() => {
        setAESKey(null);
    }, []);

    return { aesKey, regenerateKey, clearKey };
};
