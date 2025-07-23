# TOTP CLI

A command-line interface for generating Time-based One-Time Passwords (TOTP) for two-factor authentication with an interactive Google Authenticator-style interface.

## Features

- 🔥 **Interactive Mode**: Live TOTP display with real-time countdown (just like Google Authenticator!)
- 🎨 **Beautiful UI**: Colorful output with emojis and progress bars
- 📱 **Live Updates**: TOTP codes refresh automatically every 30 seconds
- 🔐 **Secure Storage**: Encrypted local storage with AES-256-CTR
- 📋 **Easy Navigation**: Arrow key navigation through stored secrets
- 🔄 **Cross-platform**: Works on Ubuntu/macOS
- 💻 **TypeScript**: Full type safety and modern development experience

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

### Interactive Mode (Recommended) 🎯

Launch the interactive interface that works just like Google Authenticator:

```bash
npm start
# or
npm start -- interactive
# or if installed globally
totp-cli
```

**Interactive Features:**
- 📱 **Live TOTP Display**: Real-time codes with countdown timer
- 🎯 **Arrow Key Navigation**: Select secrets with up/down arrows  
- 📊 **Progress Bar**: Visual countdown to next code refresh
- 🔄 **Auto-refresh**: Codes update automatically every 30 seconds
- 🎨 **Color-coded Timer**: Green → Yellow → Red as time runs out
- 📋 **Clipboard Support**: Press 'c' to copy current code to clipboard (Ubuntu/macOS)

### Command Line Mode

Generate TOTP from a secret:
```bash
npm start -- generate "JBSWY3DPEHPK3PXP"
```

Store a TOTP secret:
```bash
npm start -- add "github" "JBSWY3DPEHPK3PXP" --issuer "GitHub"
```

List stored secrets:
```bash
npm start -- list
```

Generate TOTP from stored secret:
```bash
npm start -- get "github"
```

Remove a stored secret:
```bash
npm start -- remove "github"
```

Get help:
```bash
npm start -- --help
```

## Commands

### Interactive Mode
- `interactive` or `i` - Launch full interactive mode with live TOTP display
- Default when no command is provided

### Command Line Mode  
- `generate <secret>` - Generate a TOTP code from a secret
- `add <name> <secret> [--issuer <issuer>]` - Add a new TOTP secret with a name
- `list` - List all stored TOTP secrets with colored output
- `get <name>` - Generate TOTP code for a stored secret
- `watch <name>` - Watch a specific TOTP secret with live updates
- `remove <name>` - Remove a stored TOTP secret

## Screenshots

### Interactive Mode
```
🔐 TOTP Live Display
Press Ctrl+C to exit, "c" to copy code to clipboard

📱 github

🔢 Code: 123456

⏱️  [████████████████░░░░] 27s

📋 ✅ Code copied to clipboard!

💡 This code refreshes automatically every 30 seconds
   Press "c" to copy code to clipboard
   Press Ctrl+C to return to menu
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the CLI (interactive mode by default)
- `npm run dev` - Quick build and run
- `npm run clean` - Remove build output

### Project Structure

```
src/
├── cli.ts           # Main CLI entry point
├── interactive.ts   # Interactive UI with live TOTP display
├── index.ts         # Library entry point
├── totpManager.ts   # Core TOTP functionality
└── storage.ts       # Secret storage management
```

## Security

- **Unique Encryption Keys**: Each installation generates a unique 32-byte encryption key
- **AES-256-CTR Encryption**: Secrets are encrypted using AES-256-CTR before storage
- **Secure Key Storage**: Encryption key stored in `~/.totp-cli/key.bin` with 600 permissions (owner read/write only)
- **Configuration Security**: Configuration files stored in `~/.totp-cli/` directory
- **Keytar Integration**: Includes keytar for secure system keychain integration (fallback to encrypted file storage)

## Dependencies

- **commander** - CLI argument parsing
- **inquirer** - Interactive command line interfaces
- **chalk** - Terminal colors and styling
- **clipboardy** - Cross-platform clipboard support
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
