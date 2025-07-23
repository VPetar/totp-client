# Contributing to TOTP CLI

Thank you for your interest in contributing to TOTP CLI! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/vpetar/totp-cli.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Test your changes: `npm start`

## Development

### Project Structure

```
src/
├── cli.ts           # Main CLI entry point
├── interactive.ts   # Interactive UI with live TOTP display
├── index.ts         # Library entry point
├── totpManager.ts   # Core TOTP functionality
└── storage.ts       # Secret storage management
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Build and run the CLI
- `npm run dev` - Quick build and run
- `npm run clean` - Remove build output

## Submitting Changes

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit your changes: `git commit -m "Add your feature description"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

## Code Style

- Use TypeScript
- Follow existing code style
- Add appropriate comments
- Ensure type safety

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.

## Security

If you discover a security vulnerability, please send an email to freeze.988@gmail.com rather than using the issue tracker.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
