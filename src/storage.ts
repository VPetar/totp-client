/**
 * Storage Manager - Handle secure storage of TOTP secrets
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

export interface TOTPEntry {
  name: string;
  secret: string;
  issuer?: string;
  algorithm?: string;
}

export class StorageManager {
  private static readonly CONFIG_DIR = path.join(os.homedir(), '.totp-cli');
  private static readonly CONFIG_FILE = path.join(StorageManager.CONFIG_DIR, 'secrets.json');

  /**
   * Initialize storage directory
   */
  static async init(): Promise<void> {
    await fs.ensureDir(StorageManager.CONFIG_DIR);
  }

  /**
   * Store a TOTP secret (fallback implementation using file system)
   */
  static async storeSecret(name: string, secret: string, issuer?: string): Promise<void> {
    await StorageManager.init();
    
    const entries = await StorageManager.getAllSecrets();
    const newEntry: TOTPEntry = {
      name,
      secret: StorageManager.encryptSecret(secret),
      issuer,
      algorithm: 'SHA1'
    };

    // Update or add entry
    const existingIndex = entries.findIndex(e => e.name === name);
    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    await fs.writeJson(StorageManager.CONFIG_FILE, entries, { spaces: 2 });
  }

  /**
   * Retrieve a TOTP secret
   */
  static async getSecret(name: string): Promise<string | null> {
    const entries = await StorageManager.getAllSecrets();
    const entry = entries.find(e => e.name === name);
    
    if (!entry) {
      return null;
    }

    return StorageManager.decryptSecret(entry.secret);
  }

  /**
   * Get all stored secrets (names only)
   */
  static async getAllSecrets(): Promise<TOTPEntry[]> {
    try {
      if (await fs.pathExists(StorageManager.CONFIG_FILE)) {
        return await fs.readJson(StorageManager.CONFIG_FILE);
      }
    } catch (error) {
      console.error('Error reading secrets file:', error);
    }
    return [];
  }

  /**
   * Remove a stored secret
   */
  static async removeSecret(name: string): Promise<boolean> {
    const entries = await StorageManager.getAllSecrets();
    const filteredEntries = entries.filter(e => e.name !== name);
    
    if (filteredEntries.length === entries.length) {
      return false; // Secret not found
    }

    await fs.writeJson(StorageManager.CONFIG_FILE, filteredEntries, { spaces: 2 });
    return true;
  }

  /**
   * Simple encryption for fallback storage (not recommended for production)
   */
  private static encryptSecret(secret: string): string {
    const algorithm = 'aes-256-ctr';
    const secretKey = crypto.createHash('sha256').update('totp-cli-secret-key').digest();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(secret), cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  /**
   * Simple decryption for fallback storage
   */
  private static decryptSecret(encryptedSecret: string): string {
    const algorithm = 'aes-256-ctr';
    const secretKey = crypto.createHash('sha256').update('totp-cli-secret-key').digest();
    
    const textParts = encryptedSecret.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    
    return decrypted.toString();
  }
}
