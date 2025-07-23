# Publishing Checklist

## Before Publishing

### GitHub Setup
- [ ] Create a new repository on GitHub (e.g., `vpetar/totp-client`)
- [ ] Update package.json with your actual GitHub username
- [ ] Initialize git repository and push to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit: TOTP CLI with interactive interface"
  git branch -M main
  git remote add origin https://github.com/vpetar/totp-client.git
  git push -u origin main
  ```

### NPM Setup
- [ ] Create an NPM account at npmjs.com if you don't have one
- [ ] Login to NPM: `npm login`
- [ ] Verify your email if required
- [ ] Check package name availability: `npm view totp-client` (should return 404)

### Pre-publish Checks
- [ ] Test build: `npm run build`
- [ ] Test CLI functionality: `node dist/cli.js --help`
- [ ] Test interactive mode: `node dist/cli.js interactive`
- [ ] Review package.json fields (name, version, description, author, license)
- [ ] Update CHANGELOG.md with release date
- [ ] Ensure README.md is complete and accurate

## Publishing to NPM

### First Release
```bash
# Clean build
npm run clean
npm run build

# Verify package contents
npm pack --dry-run

# Publish
npm publish
```

### Future Releases
```bash
# Update version (patch/minor/major)
npm version patch  # or minor, major

# Push tags
git push --tags

# This will trigger GitHub Actions to automatically publish
```

## Post-publish

- [ ] Verify package on npmjs.com
- [ ] Test global installation: `npm install -g totp-client`
- [ ] Update README.md with installation instructions
- [ ] Create GitHub release with changelog
- [ ] Share with community (Reddit, Twitter, etc.)

## Package Info

- **Name**: totp-client
- **Current Version**: 1.0.0
- **License**: MIT
- **Author**: freeze.988@gmail.com
- **Repository**: https://github.com/VPetar/totp-client

## Notes

- The package includes GitHub Actions for automated testing and publishing
- The `.npmignore` file controls what gets published to NPM
- Source code is excluded from NPM package (only dist/ folder is published)
- TypeScript definitions are included for library usage
