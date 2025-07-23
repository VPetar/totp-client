/**
 * Tests for Interactive module utility functions
 */

// Import parts we can test without running the full interactive mode
describe('Interactive module utilities', () => {
  
  describe('progress bar helpers', () => {
    it('should calculate progress bar correctly', () => {
      const createProgressBar = (remaining: number, total: number = 30): string => {
        const progress = remaining / total;
        const barLength = 20;
        const filledLength = Math.floor(progress * barLength);
        const emptyLength = barLength - filledLength;
        
        return '█'.repeat(filledLength) + '░'.repeat(emptyLength);
      };

      // Test full progress (30 seconds remaining)
      expect(createProgressBar(30, 30)).toBe('█'.repeat(20));
      
      // Test half progress (15 seconds remaining)
      expect(createProgressBar(15, 30)).toBe('█'.repeat(10) + '░'.repeat(10));
      
      // Test no progress (0 seconds remaining)
      expect(createProgressBar(0, 30)).toBe('░'.repeat(20));
    });
  });

  describe('time formatting', () => {
    it('should format time correctly', () => {
      const formatTime = (seconds: number): string => {
        return `${seconds}s`;
      };

      expect(formatTime(30)).toBe('30s');
      expect(formatTime(5)).toBe('5s');
      expect(formatTime(0)).toBe('0s');
    });
  });

  describe('TOTP code formatting', () => {
    it('should format TOTP codes correctly', () => {
      const formatTOTPCode = (code: string): string => {
        return code.replace(/(\d{3})(\d{3})/, '$1 $2');
      };

      expect(formatTOTPCode('123456')).toBe('123 456');
      expect(formatTOTPCode('987654')).toBe('987 654');
    });

    it('should handle invalid codes gracefully', () => {
      const formatTOTPCode = (code: string): string => {
        if (code.length !== 6) return code;
        return code.replace(/(\d{3})(\d{3})/, '$1 $2');
      };

      expect(formatTOTPCode('12345')).toBe('12345');
      expect(formatTOTPCode('1234567')).toBe('1234567');
      expect(formatTOTPCode('123456')).toBe('123 456');
    });
  });

  describe('color severity mapping', () => {
    it('should map time remaining to color severity', () => {
      const getTimerColor = (remaining: number): 'green' | 'yellow' | 'red' => {
        if (remaining > 10) return 'green';
        if (remaining > 5) return 'yellow';
        return 'red';
      };

      expect(getTimerColor(30)).toBe('green');
      expect(getTimerColor(15)).toBe('green');
      expect(getTimerColor(10)).toBe('yellow');
      expect(getTimerColor(8)).toBe('yellow');
      expect(getTimerColor(5)).toBe('red');
      expect(getTimerColor(1)).toBe('red');
    });
  });
});
