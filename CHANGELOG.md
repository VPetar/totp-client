# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-07-23

### Added
- Search and filter functionality for TOTP secrets
- Real-time filtering as you type in secret selector
- Search works across secret names, issuers, and descriptions
- Enhanced remove secret prompt with search functionality

### Changed
- Upgraded interactive secret selection to use modern `@inquirer/search`
- Improved user experience when navigating large lists of TOTP secrets

### Dependencies
- Added `@inquirer/search@^3.0.17` for enhanced search functionality

## [1.0.0] - 2025-07-23

### Added
- Initial release of TOTP CLI
- Interactive Google Authenticator-style interface with live TOTP display
- Secure encrypted storage using AES-256-CTR with unique keys per installation
- Command-line interface for managing TOTP secrets
- Clipboard integration for easy copying of codes
- Cross-platform support (Ubuntu/macOS)
- Real-time countdown timers and progress bars
- Colorful terminal output with emojis
- Arrow key navigation for secret selection
- TypeScript implementation with full type safety

### Features
- Add, list, and remove TOTP secrets
- Generate TOTP codes with standard 30-second intervals
- Encrypted local storage with unique encryption keys
- Interactive mode with live updates every second
- Command-line mode for scripting and automation
- Support for QR code secret import (manual base32 entry)

### Security
- AES-256-CTR encryption for stored secrets
- Unique 32-byte encryption key generated per installation
- No hardcoded encryption keys
- Secure file permissions for storage

## [Unreleased]

### Planned
- QR code scanning support
- Configuration file for custom settings
- Backup and restore functionality
- Multiple vault support
- Integration tests
- ESLint and Prettier configuration
