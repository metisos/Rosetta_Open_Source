# Contributing to Rosetta

Thank you for your interest in contributing to Rosetta! This document provides guidelines and information for contributors.

## Philosophy

Rosetta is an **agent-first** protocol. When contributing, keep in mind:

1. **Agents are the primary users** - Design for AI consumption first, human convenience second
2. **Token efficiency matters** - Every token counts in agent context windows
3. **Simplicity over features** - Plain markdown, no complex tooling required
4. **Open standard** - No lock-in, works with any agent that can read files

## Ways to Contribute

### 1. Agent Integration Examples

Help other developers integrate Rosetta with their AI tools:

- Write integration guides for new AI coding assistants
- Create example configurations for popular tools
- Document best practices for specific frameworks

### 2. Protocol Improvements

Suggest improvements to the ROSETTA.md format:

- New sections that provide value to agents
- Better organization of existing sections
- Token optimization strategies

### 3. CLI Enhancements

Improve the human helper tools:

- New commands that aid Rosetta management
- Better validation and error messages
- Performance improvements

### 4. Documentation

Help others understand and adopt Rosetta:

- Tutorials and guides
- Video walkthroughs
- Translations

### 5. Bug Reports

Found an issue? Please report it:

- Check existing issues first
- Provide reproduction steps
- Include relevant error messages

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
# Clone the repository
git clone https://github.com/metisos/Rosetta_Open_Source.git
cd Rosetta_Open_Source

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run CLI locally
node dist/cli/index.js --help
```

### Project Structure

```
src/
├── index.ts              # Programmatic API exports
└── cli/
    ├── index.ts          # CLI entry point
    ├── commands/         # CLI command implementations
    └── utils/            # Shared utilities
```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all source files
- Prefer `interface` over `type` for object shapes
- Use named exports (no default exports)
- Document public APIs with JSDoc comments

### Naming Conventions

- Files: `kebab-case.ts`
- Functions: `camelCase`
- Interfaces/Types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add new validation rule for module files
fix: correct metadata parsing for hyphenated keys
docs: add integration guide for Cursor
chore: update dependencies
```

## Pull Request Process

1. **Fork the repository** and create your branch from `master`

2. **Make your changes** with clear, focused commits

3. **Add tests** for new functionality

4. **Update documentation** if needed

5. **Run the test suite** to ensure nothing is broken:
   ```bash
   npm test
   npm run build
   ```

6. **Submit a pull request** with:
   - Clear description of changes
   - Link to related issue (if any)
   - Screenshots/examples if applicable

## Protocol Changes

Changes to the ROSETTA.md format require extra consideration:

### Backward Compatibility

- New sections should be optional
- Existing sections should not change meaning
- Validation should gracefully handle older formats

### Token Impact

- Measure token impact of proposed changes
- Justify additions with clear agent benefit
- Consider making verbose sections optional

### Agent Testing

- Test changes with multiple AI agents
- Document agent-specific behaviors
- Ensure changes improve agent comprehension

## Adding New Commands

When adding CLI commands:

1. Create command file in `src/cli/commands/`
2. Export from `src/cli/commands/index.ts`
3. Register in `src/cli/index.ts`
4. Add tests
5. Update README with usage

Example command structure:

```typescript
// src/cli/commands/my-command.ts
import chalk from 'chalk';

export interface MyCommandOptions {
  flag?: boolean;
}

export async function myCommand(options: MyCommandOptions): Promise<void> {
  // Implementation
  console.log(chalk.green('Success!'));
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/cli/commands/validate.test.ts
```

### Writing Tests

- Test both success and failure cases
- Mock file system operations when appropriate
- Test edge cases (empty files, missing sections, etc.)

## Questions?

- Open an issue for bugs or feature requests
- Email cjohnson@metisos.com for other inquiries

## License

By contributing to Rosetta, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make AI coding assistants more effective!
