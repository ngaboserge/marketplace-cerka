# Contributing to Cerka Materials Marketplace

Thank you for your interest in contributing to the Cerka Materials Marketplace! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase account

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/cerka-materials.git
   cd cerka-materials
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Structure
```typescript
// Component template
import React from 'react';

interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ prop }: ComponentProps) {
  return (
    <div className="component-class">
      {/* Component content */}
    </div>
  );
}
```

### File Naming Conventions
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Pages: `PascalCase.tsx`
- Services: `camelCase.service.ts`

## 🔄 Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Hotfix: `hotfix/description`

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/new-feature
   ```

5. **Create Pull Request**
   - Use the PR template
   - Link related issues
   - Request appropriate reviewers

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
- Write unit tests for utilities
- Write integration tests for services
- Write component tests for UI components

## 📊 Data Quality Guidelines

### Price Submissions
- Validate price ranges for materials
- Ensure location accuracy
- Verify photo evidence when available
- Check for duplicate submissions

### Materials Catalog
- Follow naming conventions
- Use standard units of measurement
- Maintain category consistency
- Update specifications accurately

### Supplier Information
- Verify business credentials
- Validate contact information
- Check delivery area accuracy
- Maintain rating integrity

## 📚 Documentation

### Code Documentation
- Use JSDoc for functions
- Comment complex algorithms
- Update README for new features
- Document API changes

### Materials Documentation
- Document new material categories
- Update pricing algorithms
- Explain intelligence features
- Include usage examples

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Verify the bug exists
- Test with different materials/locations
- Gather reproduction steps

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Material/Location Context**
- Material: [e.g. Cement]
- Location: [e.g. Kigali]
- Price Range: [e.g. 20,000-25,000 RWF]

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.2.3]
```

## 💡 Feature Requests

### Before Submitting
- Check if feature already exists
- Consider marketplace impact
- Think about data requirements

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed for the marketplace?

**Proposed Solution**
How should it work?

**Data Requirements**
What data is needed?

**Alternatives**
Other ways to solve the problem
```

## 🔒 Security

### Reporting Security Issues
- Email: security@cerka.rw
- Do not create public issues for security vulnerabilities
- Provide detailed reproduction steps

### Security Guidelines
- Never commit secrets or API keys
- Validate all price submissions
- Protect supplier information
- Follow data privacy regulations

## 📖 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)

### Platform Specific
- [Materials Marketplace Guide](./README.md)
- [Database Schema](./supabase/migrations/)
- [API Services](./src/services/)
- [Intelligence Features](./src/components/intelligence/)

## 🎯 Areas for Contribution

### High Priority
- Price intelligence improvements
- Data quality enhancements
- Supplier verification features
- Mobile responsiveness

### Medium Priority
- New material categories
- Advanced analytics
- Market prediction features
- Integration capabilities

### Low Priority
- UI/UX improvements
- Performance optimizations
- Code refactoring
- Documentation updates

## 🏗️ Materials & Pricing Guidelines

### Adding New Materials
1. Research market demand
2. Define standard units
3. Set up price validation rules
4. Create category structure
5. Update database schema

### Price Intelligence Features
- Implement trend analysis
- Add market signals
- Create price forecasts
- Build quality scoring

### Supplier Features
- Verification workflows
- Rating systems
- Quote management
- Delivery tracking

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Materials marketplace credits
- Community highlights

## 📞 Getting Help

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Email: materials@cerka.rw

### Response Times
- Bug reports: 24-48 hours
- Feature requests: 1-2 weeks
- Pull requests: 2-5 business days
- Data quality issues: 12-24 hours

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Cerka Materials Marketplace! 🏗️