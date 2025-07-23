/**
 * Tests for main index exports
 */

import { TOTPManager, StorageManager } from '../src/index';

describe('Index exports', () => {
  it('should export TOTPManager', () => {
    expect(TOTPManager).toBeDefined();
    expect(typeof TOTPManager.generateTOTP).toBe('function');
    expect(typeof TOTPManager.verifyTOTP).toBe('function');
    expect(typeof TOTPManager.getTimeRemaining).toBe('function');
  });

  it('should export StorageManager', () => {
    expect(StorageManager).toBeDefined();
    expect(typeof StorageManager.init).toBe('function');
    expect(typeof StorageManager.storeSecret).toBe('function');
    expect(typeof StorageManager.getSecret).toBe('function');
    expect(typeof StorageManager.getAllSecrets).toBe('function');
    expect(typeof StorageManager.removeSecret).toBe('function');
  });
});
