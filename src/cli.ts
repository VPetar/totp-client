#!/usr/bin/env node

/**
 * TOTP CLI - Time-based One-Time Password CLI application
 */

import { Command } from 'commander';
import * as pkg from '../package.json';
import { TOTPManager } from './totpManager';
import { StorageManager } from './storage';
import { InteractiveUI } from './interactive';
import chalk from 'chalk';

// Set up the CLI program
const program = new Command();

program
  .name('totp-client')
  .description('CLI tool for generating TOTP (Time-based One-Time Password) codes')
  .version(pkg.version);

// Interactive mode - default when no command is provided
program
  .command('interactive')
  .alias('i')
  .description('Launch interactive mode with live TOTP display')
  .action(async () => {
    try {
      await InteractiveUI.showMainMenu();
    } catch (error) {
      console.error(chalk.red('Error in interactive mode:'), error);
      process.exit(1);
    }
  });

// Generate TOTP from a secret
program
  .command('generate <secret>')
  .description('Generate a TOTP code from a secret')
  .action(async (secret: string) => {
    try {
      const code = TOTPManager.generateTOTP(secret);
      const timeRemaining = TOTPManager.getTimeRemaining();
      console.log(chalk.green(`🔢 TOTP Code: ${chalk.bold(code)}`));
      console.log(chalk.blue(`⏱️  Time remaining: ${timeRemaining}s`));
    } catch (error) {
      console.error(chalk.red('❌ Error generating TOTP:'), error);
      process.exit(1);
    }
  });

// Add a new TOTP secret
program
  .command('add <name> <secret>')
  .description('Add a new TOTP secret with a name')
  .option('-i, --issuer <issuer>', 'Optional issuer name')
  .action(async (name: string, secret: string, options: { issuer?: string }) => {
    try {
      await StorageManager.storeSecret(name, secret, options.issuer);
      console.log(chalk.green(`✅ Successfully added TOTP secret for: ${chalk.bold(name)}`));
    } catch (error) {
      console.error(chalk.red('❌ Error storing TOTP secret:'), error);
      process.exit(1);
    }
  });

// List all stored secrets
program
  .command('list')
  .description('List all stored TOTP secrets')
  .action(async () => {
    try {
      const secrets = await StorageManager.getAllSecrets();
      if (secrets.length === 0) {
        console.log(chalk.yellow('📭 No TOTP secrets found.'));
        console.log(chalk.gray('💡 Use "add" command to store your first TOTP secret.'));
        return;
      }
      
      console.log(chalk.cyan.bold('📋 Stored TOTP secrets:'));
      secrets.forEach((entry, index) => {
        const number = chalk.gray(`${index + 1}.`);
        const name = chalk.green.bold(entry.name);
        const issuer = entry.issuer ? chalk.gray(` (${entry.issuer})`) : '';
        console.log(`${number} ${name}${issuer}`);
      });
      console.log(chalk.gray('\n💡 Use "interactive" mode for live TOTP codes!'));
    } catch (error) {
      console.error(chalk.red('❌ Error listing TOTP secrets:'), error);
      process.exit(1);
    }
  });

// Generate TOTP from stored secret
program
  .command('get <name>')
  .description('Generate TOTP code for a stored secret')
  .action(async (name: string) => {
    try {
      const secret = await StorageManager.getSecret(name);
      if (!secret) {
        console.error(chalk.red(`❌ TOTP secret not found: ${name}`));
        console.log(chalk.gray('💡 Use "list" command to see available secrets.'));
        process.exit(1);
      }
      
      const code = TOTPManager.generateTOTP(secret);
      const timeRemaining = TOTPManager.getTimeRemaining();
      console.log(chalk.green(`🔢 TOTP Code for ${chalk.bold(name)}: ${chalk.bold(code)}`));
      console.log(chalk.blue(`⏱️  Time remaining: ${timeRemaining}s`));
      console.log(chalk.gray('💡 Use "watch <name>" for live updates!'));
    } catch (error) {
      console.error(chalk.red('❌ Error generating TOTP:'), error);
      process.exit(1);
    }
  });

// Watch a specific secret with live updates
program
  .command('watch <name>')
  .description('Watch a specific TOTP secret with live updates')
  .action(async (name: string) => {
    try {
      const secret = await StorageManager.getSecret(name);
      if (!secret) {
        console.error(chalk.red(`❌ TOTP secret not found: ${name}`));
        console.log(chalk.gray('💡 Use "list" command to see available secrets.'));
        process.exit(1);
      }
      
      await InteractiveUI.showLiveTOTP(name);
    } catch (error) {
      console.error(chalk.red('❌ Error watching TOTP:'), error);
      process.exit(1);
    }
  });

// Remove a stored secret
program
  .command('remove <name>')
  .description('Remove a stored TOTP secret')
  .action(async (name: string) => {
    try {
      const removed = await StorageManager.removeSecret(name);
      if (removed) {
        console.log(chalk.green(`✅ Successfully removed TOTP secret: ${chalk.bold(name)}`));
      } else {
        console.error(chalk.red(`❌ TOTP secret not found: ${name}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error removing TOTP secret:'), error);
      process.exit(1);
    }
  });

// Default action when no command is provided - launch interactive mode
program.action(async () => {
  try {
    console.log(chalk.cyan.bold('🔐 Welcome to TOTP CLI!'));
    console.log(chalk.gray('Launching interactive mode...\n'));
    await InteractiveUI.showMainMenu();
  } catch (error) {
    console.error(chalk.red('Error launching interactive mode:'), error);
    process.exit(1);
  }
});

// Parse command line arguments
program.parse();
