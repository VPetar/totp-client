/**
 * Interactive UI - Enhanced user interface with real-time TOTP display
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { default as clipboardy } from 'clipboardy';
import { StorageManager } from './storage';
import { TOTPManager } from './totpManager';

export class InteractiveUI {
  private static updateInterval: NodeJS.Timeout | null = null;

  /**
   * Show interactive list of TOTP secrets for selection
   */
  static async showSecretSelector(): Promise<void> {
    const secrets = await StorageManager.getAllSecrets();
    
    if (secrets.length === 0) {
      console.log(chalk.yellow('📭 No TOTP secrets found.'));
      console.log(chalk.gray('Use "add" command to store your first TOTP secret.'));
      return;
    }

    const choices = secrets.map((entry) => ({
      name: `${entry.name}${entry.issuer ? chalk.gray(` (${entry.issuer})`) : ''}`,
      value: entry.name,
      short: entry.name
    }));

    choices.push(
      { name: '─────────────', value: '__separator__', short: '' } as any,
      {
        name: chalk.red('🚪 Exit'),
        value: '__exit__',
        short: 'Exit'
      }
    );

    const { selectedSecret } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedSecret',
        message: chalk.cyan('🔐 Select a TOTP secret:'),
        choices,
        pageSize: 10
      }
    ]);

    if (selectedSecret === '__exit__' || selectedSecret === '__separator__') {
      console.log(chalk.gray('Goodbye! 👋'));
      return;
    }

    await InteractiveUI.showLiveTOTP(selectedSecret);
  }

  /**
   * Show live TOTP display with real-time updates (Google Authenticator style)
   */
  static async showLiveTOTP(secretName: string): Promise<void> {
    const secret = await StorageManager.getSecret(secretName);
    if (!secret) {
      console.log(chalk.red(`❌ Secret not found: ${secretName}`));
      return;
    }

    // Clear the screen and hide cursor
    console.clear();
    process.stdout.write('\x1B[?25l');

    let isRunning = true;
    let currentCode = '';
    let timeRemaining = 0;
    let lastCopyTime = 0;

    // Set up raw mode for keyboard input
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }

    const updateDisplay = () => {
      try {
        currentCode = TOTPManager.generateTOTP(secret);
        timeRemaining = TOTPManager.getTimeRemaining();
        
        // Clear screen and move cursor to top
        console.clear();
        
        // Header
        console.log(chalk.cyan.bold('🔐 TOTP Live Display'));
        console.log(chalk.gray('Press Ctrl+C to exit, "c" to copy code to clipboard\n'));
        
        // Secret name
        console.log(chalk.blue.bold(`📱 ${secretName}`));
        
        // TOTP Code with large styling
        console.log(chalk.green.bold(`\n🔢 Code: ${currentCode}`));
        
        // Progress bar for time remaining
        const progressBar = InteractiveUI.createProgressBar(timeRemaining, 30);
        console.log(`\n⏱️  ${progressBar} ${timeRemaining}s`);
        
        // Show copy confirmation if recently copied
        const now = Date.now();
        if (now - lastCopyTime < 2000) {
          console.log(chalk.green.bold('\n📋 ✅ Code copied to clipboard!'));
        }
        
        // Instructions
        console.log(chalk.gray('\n💡 This code refreshes automatically every 30 seconds'));
        console.log(chalk.gray('   Press "c" to copy code to clipboard'));
        console.log(chalk.gray('   Press Ctrl+C to return to menu'));
        
      } catch (error) {
        console.log(chalk.red('❌ Error generating TOTP:'), error);
        isRunning = false;
      }
    };

    // Handle keyboard input
    const keyPressHandler = async (data: Buffer) => {
      const key = data.toString();
      
      // Handle Ctrl+C (ASCII 3)
      if (data[0] === 3) {
        isRunning = false;
        InteractiveUI.stopLiveDisplay();
        console.log(chalk.yellow('\n👋 Returning to main menu...'));
        
        // Show the selector again
        setTimeout(async () => {
          await InteractiveUI.showSecretSelector();
        }, 500);
        return;
      }
      
      // Handle 'c' key for copy
      if (key.toLowerCase() === 'c') {
        try {
          await clipboardy.write(currentCode);
          lastCopyTime = Date.now();
          updateDisplay(); // Refresh display to show copy confirmation
        } catch (error) {
          console.log(chalk.red('\n❌ Failed to copy to clipboard:'), error);
        }
      }
    };

    if (process.stdin.isTTY) {
      process.stdin.on('data', keyPressHandler);
    }

    // Initial display
    updateDisplay();

    // Set up interval for updates every second
    InteractiveUI.updateInterval = setInterval(() => {
      if (!isRunning) {
        InteractiveUI.stopLiveDisplay();
        return;
      }
      updateDisplay();
    }, 1000);

    // Handle process termination gracefully
    const exitHandler = () => {
      isRunning = false;
      InteractiveUI.stopLiveDisplay();
    };

    process.once('SIGINT', exitHandler);
    process.once('SIGTERM', exitHandler);
  }

  /**
   * Stop the live display and clean up
   */
  static stopLiveDisplay(): void {
    if (InteractiveUI.updateInterval) {
      clearInterval(InteractiveUI.updateInterval);
      InteractiveUI.updateInterval = null;
    }
    
    // Show cursor again
    process.stdout.write('\x1B[?25h');
    
    // Restore normal stdin mode
    if (process.stdin.isTTY && process.stdin.setRawMode) {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }
    
    // Remove all event listeners
    process.stdin.removeAllListeners('data');
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGTERM');
  }

  /**
   * Create a visual progress bar for time remaining
   */
  private static createProgressBar(current: number, total: number): string {
    const barLength = 20;
    const filledLength = Math.round((current / total) * barLength);
    const emptyLength = barLength - filledLength;
    
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);
    
    // Color the bar based on time remaining
    let coloredBar: string;
    if (current > 20) {
      coloredBar = chalk.green(filled) + chalk.gray(empty);
    } else if (current > 10) {
      coloredBar = chalk.yellow(filled) + chalk.gray(empty);
    } else {
      coloredBar = chalk.red(filled) + chalk.gray(empty);
    }
    
    return `[${coloredBar}]`;
  }

  /**
   * Show interactive prompt for adding a new secret
   */
  static async showAddSecretPrompt(): Promise<void> {
    console.log(chalk.cyan.bold('🔐 Add New TOTP Secret\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: chalk.blue('📝 Enter a name for this secret:'),
        validate: (input: string) => {
          if (!input.trim()) {
            return chalk.red('Please enter a valid name');
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'secret',
        message: chalk.blue('🔑 Enter the TOTP secret:'),
        validate: (input: string) => {
          if (!input.trim()) {
            return chalk.red('Please enter a valid secret');
          }
          // Basic validation for base32 format
          if (!/^[A-Z2-7]+=*$/i.test(input.trim())) {
            return chalk.yellow('Warning: This doesn\'t look like a valid base32 secret');
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'issuer',
        message: chalk.blue('🏢 Enter issuer (optional):'),
      }
    ]);

    try {
      await StorageManager.storeSecret(
        answers.name.trim(),
        answers.secret.trim(),
        answers.issuer.trim() || undefined
      );
      
      console.log(chalk.green(`✅ Successfully added TOTP secret for: ${answers.name}`));
      
      // Ask if they want to test it
      const { testNow } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'testNow',
          message: chalk.cyan('🧪 Would you like to test this secret now?'),
          default: true
        }
      ]);

      if (testNow) {
        await InteractiveUI.showLiveTOTP(answers.name.trim());
      }
      
    } catch (error) {
      console.log(chalk.red('❌ Error storing TOTP secret:'), error);
    }
  }

  /**
   * Show main menu
   */
  static async showMainMenu(): Promise<void> {
    console.clear();
    console.log(chalk.cyan.bold('🔐 TOTP CLI - Interactive Mode\n'));

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: chalk.blue('What would you like to do?'),
        choices: [
          {
            name: chalk.green('📱 View TOTP Codes (Live)'),
            value: 'view',
            short: 'View Codes'
          },
          {
            name: chalk.yellow('➕ Add New Secret'),
            value: 'add',
            short: 'Add Secret'
          },
          {
            name: chalk.blue('📋 List All Secrets'),
            value: 'list',
            short: 'List Secrets'
          },
          {
            name: chalk.red('🗑️  Remove Secret'),
            value: 'remove',
            short: 'Remove Secret'
          },
          new inquirer.Separator(),
          {
            name: chalk.gray('🚪 Exit'),
            value: 'exit',
            short: 'Exit'
          }
        ]
      }
    ]);

    switch (action) {
      case 'view':
        await InteractiveUI.showSecretSelector();
        break;
      case 'add':
        await InteractiveUI.showAddSecretPrompt();
        break;
      case 'list':
        await InteractiveUI.showSecretsList();
        break;
      case 'remove':
        await InteractiveUI.showRemoveSecretPrompt();
        break;
      case 'exit':
        console.log(chalk.gray('Goodbye! 👋'));
        process.exit(0);
        break;
    }
  }

  /**
   * Show formatted list of all secrets
   */
  static async showSecretsList(): Promise<void> {
    const secrets = await StorageManager.getAllSecrets();
    
    console.clear();
    console.log(chalk.cyan.bold('📋 Stored TOTP Secrets\n'));
    
    if (secrets.length === 0) {
      console.log(chalk.yellow('📭 No TOTP secrets found.'));
    } else {
      secrets.forEach((entry, index) => {
        const number = chalk.gray(`${index + 1}.`);
        const name = chalk.green.bold(entry.name);
        const issuer = entry.issuer ? chalk.gray(` (${entry.issuer})`) : '';
        console.log(`${number} ${name}${issuer}`);
      });
    }

    console.log(''); // Empty line
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: chalk.gray('Press Enter to return to main menu...'),
      }
    ]);

    await InteractiveUI.showMainMenu();
  }

  /**
   * Show interactive prompt for removing a secret
   */
  static async showRemoveSecretPrompt(): Promise<void> {
    const secrets = await StorageManager.getAllSecrets();
    
    if (secrets.length === 0) {
      console.log(chalk.yellow('📭 No TOTP secrets found to remove.'));
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: chalk.gray('Press Enter to return to main menu...'),
        }
      ]);
      await InteractiveUI.showMainMenu();
      return;
    }

    const choices = secrets.map(entry => ({
      name: `${entry.name}${entry.issuer ? chalk.gray(` (${entry.issuer})`) : ''}`,
      value: entry.name
    }));

    choices.push(
      { name: '─────────────', value: '__separator__' } as any,
      {
        name: chalk.gray('🔙 Back to Main Menu'),
        value: '__back__'
      }
    );

    const { secretToRemove } = await inquirer.prompt([
      {
        type: 'list',
        name: 'secretToRemove',
        message: chalk.red('🗑️  Select secret to remove:'),
        choices
      }
    ]);

    if (secretToRemove === '__back__' || secretToRemove === '__separator__') {
      await InteractiveUI.showMainMenu();
      return;
    }

    // Confirm deletion
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: chalk.red(`⚠️  Are you sure you want to remove "${secretToRemove}"?`),
        default: false
      }
    ]);

    if (confirmed) {
      try {
        await StorageManager.removeSecret(secretToRemove);
        console.log(chalk.green(`✅ Successfully removed: ${secretToRemove}`));
      } catch (error) {
        console.log(chalk.red('❌ Error removing secret:'), error);
      }
    } else {
      console.log(chalk.gray('Removal cancelled.'));
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: chalk.gray('Press Enter to return to main menu...'),
      }
    ]);

    await InteractiveUI.showMainMenu();
  }
}
