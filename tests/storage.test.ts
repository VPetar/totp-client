/**
 * Tests for Storage Manager
 */

import { StorageManager } from '../src/storage';

// Simple integration-style tests that test the public interface
describe('StorageManager', () => {
  
  describe('init', () => {
    it('should be callable without errors', async () => {
      await expect(StorageManager.init()).resolves.not.toThrow();
    });
  });

  describe('getAllSecrets', () => {
    it('should return an array', async () => {
      const secrets = await StorageManager.getAllSecrets();
      expect(Array.isArray(secrets)).toBe(true);
    });
  });

  describe('removeSecret', () => {
    it('should return boolean for non-existent secret', async () => {
      const result = await StorageManager.removeSecret('non-existent-secret-test-12345');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getSecret', () => {
    it('should return null for non-existent secret', async () => {
      const secret = await StorageManager.getSecret('non-existent-secret-test-12345');
      expect(secret).toBeNull();
    });
  });

  describe('storeSecret and getSecret integration', () => {
    const testSecretName = 'test-secret-' + Date.now();
    const testSecret = 'JBSWY3DPEHPK3PXP';
    const testIssuer = 'Test Issuer';

    afterEach(async () => {
      // Clean up test secret
      await StorageManager.removeSecret(testSecretName);
    });

    it('should store and retrieve a secret', async () => {
      // Store the secret
      await StorageManager.storeSecret(testSecretName, testSecret, testIssuer);
      
      // Retrieve the secret
      const retrievedSecret = await StorageManager.getSecret(testSecretName);
      
      expect(retrievedSecret).toBe(testSecret);
    });

    it('should list stored secrets', async () => {
      // Store the secret
      await StorageManager.storeSecret(testSecretName, testSecret, testIssuer);
      
      // Get all secrets
      const allSecrets = await StorageManager.getAllSecrets();
      
      // Should find our test secret
      const foundSecret = allSecrets.find(s => s.name === testSecretName);
      expect(foundSecret).toBeDefined();
      expect(foundSecret?.issuer).toBe(testIssuer);
    });

    it('should remove stored secrets', async () => {
      // Store the secret
      await StorageManager.storeSecret(testSecretName, testSecret, testIssuer);
      
      // Verify it exists
      let retrievedSecret = await StorageManager.getSecret(testSecretName);
      expect(retrievedSecret).toBe(testSecret);
      
      // Remove it
      const removed = await StorageManager.removeSecret(testSecretName);
      expect(removed).toBe(true);
      
      // Verify it's gone
      retrievedSecret = await StorageManager.getSecret(testSecretName);
      expect(retrievedSecret).toBeNull();
    });

    it('should update existing secret', async () => {
      const newSecret = 'GEZDGNBVGY3TQOJQ';
      
      // Store initial secret
      await StorageManager.storeSecret(testSecretName, testSecret, testIssuer);
      
      // Update with new secret
      await StorageManager.storeSecret(testSecretName, newSecret, testIssuer);
      
      // Verify the update
      const retrievedSecret = await StorageManager.getSecret(testSecretName);
      expect(retrievedSecret).toBe(newSecret);
    });
  });
});
