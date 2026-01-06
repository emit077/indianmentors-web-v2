import CryptoJS from 'crypto-js';

const DEFAULT_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key-change-in-production';

/**
 * Encrypts a string value using AES encryption
 */
export function encrypt(value: string | number): string {
  return CryptoJS.AES.encrypt(String(value), DEFAULT_KEY).toString();
}

/**
 * Decrypts an encrypted string using AES decryption
 */
export function decrypt(encryptedValue: string): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, DEFAULT_KEY);
  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  if (!decryptedString) {
    throw new Error('Failed to decrypt value - invalid key or corrupted data');
  }

  return decryptedString;
}
