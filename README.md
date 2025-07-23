# TOTP CLI

A command-line interface for generating Time-based One-Time Passwords (TOTP) for two-factor authentication.

## Features

- Generate TOTP codes from secrets
- Store and manage multiple TOTP secrets securely
- Cross-platform support (Ubuntu/macOS)
- TypeScript implementation with full type safety
- Encrypted local storage fallback

## Installation

### From Source

```bash
# Clone the repository
git clone <repository-url>
cd totp-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Usage

### Generate TOTP from a secret

```bash
npm start -- generate "JBSWY3DPEHPK3PXP"
# or if installed globally
totp-cli generate "JBSWY3DPEHPK3PXP"
```

### Store a TOTP secret

```bash
npm start -- add "github" "JBSWY3DPEHPK3PXP" --issuer "GitHub"
```

### List stored secrets

```bash
npm start -- list
```

### Generate TOTP from stored secret

```bash
npm start -- get "github"
```

### Remove a stored secret

```bash
npm start -- remove "github"
```

### Get help

```bash
npm start -- --help
npm start -- <command> --help
```

## Commands

- `generate <secret>` - Generate a TOTP code from a secret
- `add <name> <secret> [--issuer <issuer>]` - Add a new TOTP secret with a name
- `list` - List all stored TOTP secrets
- `get <name>` - Generate TOTP code for a stored secret
- `remove <name>` - Remove a stored TOTP secret

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the CLI
- `npm run dev` - Quick build and run
- `npm run clean` - Remove build output

### Project Structure

```
src/
├── cli.ts          # Main CLI entry point
├── index.ts        # Library entry point
├── totpManager.ts  # Core TOTP functionality
└── storage.ts      # Secret storage management
```

## Security

- Secrets are encrypted using AES-256-CTR before storage
- Configuration files are stored in `~/.totp-cli/`
- The project includes keytar for secure system keychain integration (fallback to encrypted file storage)

## Dependencies

- **commander** - CLI argument parsing
- **otplib** - TOTP generation and verification
- **fs-extra** - Enhanced file system operations
- **keytar** - Secure system keychain access
- **crypto** (built-in) - Cryptographic functions
- **os** (built-in) - Operating system utilities

## Requirements

- Node.js >= 14.0.0
- Ubuntu or macOS

## License

ISC
