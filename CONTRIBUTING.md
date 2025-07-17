# Contributing to Jazzup 🤝

Thank you for your interest in contributing to Jazzup! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

- **Report bugs** and suggest features
- **Improve documentation** and tutorials
- **Submit code** for new features or fixes
- **Test the application** and provide feedback
- **Help with translations** for international users
- **Share the project** with your community

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/jazzup.git
cd jazzup
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

See [SETUP.md](SETUP.md) for detailed setup instructions.

### 3. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Development Guidelines

### Code Style

We use strict code formatting and linting:

```bash
# Format code
npm run format

# Check TypeScript
npm run typecheck

# Run tests
npm run test
```

### Commit Convention

We follow [Conventional Commits](https://conventionalcommits.org/):

```bash
# Examples
git commit -m "feat: add real-time alert notifications"
git commit -m "fix: resolve location permission issue on iOS"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve alert filtering performance"
```

**Types:**

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Code Standards

#### TypeScript

- **Strict mode enabled** - All code must pass TypeScript strict checks
- **Explicit types** - Avoid `any`, use proper type definitions
- **Interface definitions** - Create interfaces for all data structures

```typescript
// Good
interface AlertData {
  id: string;
  title: string;
  type: 'safety' | 'traffic' | 'weather';
  location: { lat: number; lng: number };
}

// Avoid
const alertData: any = { ... };
```

#### React Components

- **Functional components** with hooks
- **TypeScript props interfaces** for all components
- **Descriptive naming** for components and functions

```typescript
// Component example
interface AlertCardProps {
  alert: AlertData;
  onVote: (id: string, direction: "up" | "down") => void;
  isAuthenticated: boolean;
}

export default function AlertCard({
  alert,
  onVote,
  isAuthenticated,
}: AlertCardProps) {
  // Component implementation
}
```

#### CSS/Styling

- **Tailwind CSS** for all styling
- **Responsive design** - mobile-first approach
- **Semantic class names** when using custom CSS

```typescript
// Good - Mobile-first responsive
<div className="w-full p-4 md:p-6 lg:p-8">

// Good - Semantic utility combinations
<button className="bg-alert text-alert-foreground hover:bg-alert/90 px-4 py-2 rounded-lg">
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Unit tests** for utility functions
- **Component tests** for React components
- **Integration tests** for complex workflows

```typescript
// Example test
import { describe, it, expect } from "vitest";
import { calculateDistance } from "../lib/googleMaps";

describe("calculateDistance", () => {
  it("should calculate distance between two points", () => {
    const point1 = { lat: 37.3387, lng: -121.8853 };
    const point2 = { lat: 37.3688, lng: -121.9026 };

    const distance = calculateDistance(point1, point2);
    expect(distance).toBeCloseTo(3.2, 1); // ~3.2km
  });
});
```

## 🐛 Bug Reports

When reporting bugs, please include:

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. iOS, Android, Windows, macOS]
- Browser: [e.g. Chrome 96, Safari 15]
- Device: [e.g. iPhone 12, Desktop]
- Jazzup Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

We welcome feature suggestions! Please use this template:

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.

**Community Impact**
How would this feature help the community?
```

## 📋 Pull Request Process

### 1. Prepare Your PR

- [ ] Code follows our style guidelines
- [ ] Tests pass (`npm run test`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional format

### 2. PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)

Add screenshots to help explain your changes

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

### 3. Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** by community members
4. **Approval** and merge

## 🏗️ Architecture Guidelines

### Component Structure

```
components/
├── ui/              # Base UI components (buttons, inputs, etc.)
├── layout/          # Layout components (headers, navigation)
├── features/        # Feature-specific components
└── modals/          # Modal components
```

### State Management

- **React Context** for global state (auth, theme)
- **Local state** with useState for component state
- **Supabase real-time** for live data synchronization

### API Integration

- **Supabase client** for database operations
- **Google Maps API** for mapping features
- **Error handling** with try/catch and user feedback

## 🔐 Security Considerations

### Data Protection

- **Never commit** API keys or sensitive data
- **Validate input** on both client and server
- **Use environment variables** for configuration
- **Implement proper** error handling

### Privacy

- **Minimal data collection** - only what's necessary
- **User consent** for location and notifications
- **Data retention policies** - automatic cleanup
- **Transparent privacy** practices

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Calculates distance between two geographic points
 * @param point1 - First coordinate point
 * @param point2 - Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number },
): number {
  // Implementation
}
```

### README Updates

When adding features, update:

- Feature list in README.md
- API documentation
- Setup instructions if needed
- Screenshots/examples

## 🚀 Deployment

### Development Deployment

- **Pull requests** automatically deploy preview environments
- **Staging environment** for testing before production
- **Production deployment** after review and testing

### Release Process

1. **Version bump** following semantic versioning
2. **Changelog** update with new features and fixes
3. **Tag release** with git tags
4. **Production deployment** with monitoring

## 🤝 Community

### Communication

- **GitHub Discussions** for general questions
- **GitHub Issues** for bugs and feature requests
- **Pull Request reviews** for code collaboration
- **Community Forum** for user support

### Code of Conduct

- **Be respectful** and inclusive
- **Constructive feedback** in reviews
- **Help newcomers** get started
- **Acknowledge contributions** from others

## 🎯 Priority Areas

We especially welcome contributions in:

- **Mobile optimization** and PWA features
- **Accessibility improvements** (a11y)
- **Performance optimizations**
- **Internationalization** (i18n)
- **Documentation** and tutorials
- **Testing coverage** improvements

## 🏆 Recognition

Contributors will be:

- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes**
- **Credited in documentation**
- **Invited to contributor meetings**

## 📞 Questions?

- **GitHub Discussions** - General questions
- **Email maintainers** - security@jazzup.app
- **Community Chat** - Join our Discord/Slack
- **Documentation** - Check existing docs first

Thank you for contributing to making communities safer! 🙏

---

**Happy coding!** 🚀
