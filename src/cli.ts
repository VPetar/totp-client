#!/usr/bin/env node

/**
 * TOTP CLI - Time-based One-Time Password CLI application
 */

import { Command } from 'commander';
import * as pkg from '../package.json';
import { TOTPManager } from './totpManager';
import { StorageManager } from './storage';

// Set up the CLI program
const program = new Command();

program
  .name('totp-cli')
  .description('CLI tool for generating TOTP (Time-based One-Time Password) codes')
  .version(pkg.version);

// Generate TOTP from a secret
program
  .command('generate <secret>')
  .description('Generate a TOTP code from a secret')
  .action(async (secret: string) => {
    try {
      const code = TOTPManager.generateTOTP(secret);
      const timeRemaining = TOTPManager.getTimeRemaining();
      console.log(`TOTP Code: ${code}`);
      console.log(`Time remaining: ${timeRemaining}s`);
    } catch (error) {
      console.error('Error generating TOTP:', error);
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
      console.log(`Successfully added TOTP secret for: ${name}`);
    } catch (error) {
      console.error('Error storing TOTP secret:', error);
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
        console.log('No TOTP secrets found.');
        return;
      }
      
      console.log('Stored TOTP secrets:');
      secrets.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.name}${entry.issuer ? ` (${entry.issuer})` : ''}`);
      });
    } catch (error) {
      console.error('Error listing TOTP secrets:', error);
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
        console.error(`TOTP secret not found: ${name}`);
        process.exit(1);
      }
      
      const code = TOTPManager.generateTOTP(secret);
      const timeRemaining = TOTPManager.getTimeRemaining();
      console.log(`TOTP Code for ${name}: ${code}`);
      console.log(`Time remaining: ${timeRemaining}s`);
    } catch (error) {
      console.error('Error generating TOTP:', error);
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
        console.log(`Successfully removed TOTP secret: ${name}`);
      } else {
        console.error(`TOTP secret not found: ${name}`);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error removing TOTP secret:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
