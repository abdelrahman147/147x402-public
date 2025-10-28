# Contributing to 147x402

Thank you for your interest in contributing to 147x402! We welcome contributions from the community and are excited to work together to build the future of programmatic payments.

## How to Contribute

### 1. Fork the Repository
1. Go to the [147x402 repository](https://github.com/abdelrahman147/147x402)
2. Click the "Fork" button in the top right corner
3. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/147x402.git
   cd 147x402
   ```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Write clean, well-documented code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes
```bash
# Run tests
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/abdelrahman147/147x402.git
cd 147x402

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Project Structure
```
147x402/
├── packages/
│   ├── facilitator/     # Payment facilitator service
│   ├── seller-sdk/      # SDK for API sellers
│   ├── buyer-sdk/       # SDK for API buyers
│   └── dashboard/       # Web dashboard
├── examples/            # Example implementations
├── docs/               # Documentation
└── contracts/          # Solana smart contracts
```

## Coding Standards

### JavaScript/TypeScript
- Use TypeScript for new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Use async/await instead of callbacks

### Solana/Anchor
- Follow Anchor best practices
- Add comprehensive tests
- Use proper error handling
- Document all public functions

### Documentation
- Update README.md for major changes
- Add API documentation for new endpoints
- Include code examples
- Update CHANGELOG.md

## Types of Contributions

### 🐛 Bug Fixes
- Fix existing issues
- Improve error handling
- Add missing validation

### ✨ New Features
- Add new API endpoints
- Implement new SDK methods
- Add new integrations
- Improve performance

### 📚 Documentation
- Improve existing docs
- Add tutorials
- Create examples
- Update API references

### 🧪 Testing
- Add unit tests
- Add integration tests
- Improve test coverage
- Add performance tests

### 🔧 Infrastructure
- Improve CI/CD
- Add monitoring
- Optimize build process
- Add deployment tools

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows our style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Commit messages are clear

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Issue Guidelines

### Bug Reports
When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests
When requesting features, please include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Any alternatives considered

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

### Communication
- Use GitHub issues for discussions
- Join our Discord for real-time chat
- Follow our Twitter for updates
- Check our blog for announcements

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Social media shoutouts
- Special Discord roles

## Questions?

If you have any questions about contributing:
- Open a GitHub issue
- Join our Discord server
- Email us at dev@147x402.xyz

Thank you for contributing to 147x402! 🚀
