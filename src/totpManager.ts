/**
 * TOTP Manager - Core TOTP functionality
 */

import { authenticator } from 'otplib';

export class TOTPManager {
  /**
   * Generate a TOTP code from a secret
   */
  static generateTOTP(secret: string): string {
    return authenticator.generate(secret);
  }

  /**
   * Verify a TOTP code against a secret
   */
  static verifyTOTP(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }

  /**
   * Get the time remaining until the next TOTP code
   */
  static getTimeRemaining(): number {
    const period = 30; // TOTP period in seconds
    const time = Math.floor(Date.now() / 1000);
    return period - (time % period);
  }
}
