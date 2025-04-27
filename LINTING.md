# Linting and Code Style Guidelines

This project uses ESLint and Prettier to enforce consistent code style and catch potential issues.

## Setup

The linting setup includes:

- ESLint for TypeScript
- Prettier for code formatting
- Husky for Git hooks
- lint-staged for running linters on staged files

## Commands

### Lint Code

```bash
npm run lint
```

This checks for linting errors without modifying files.

### Fix Linting Issues

```bash
npm run lint:fix
```

This automatically fixes linting issues where possible.

### Format Code

```bash
npm run format
```

This formats all TypeScript files using Prettier.

## Git Hooks

The project uses Husky to set up Git hooks:

- **pre-commit**: Runs linting and formatting on staged files before allowing commit
- **commit-msg**: Ensures commit messages follow the conventional commit format

### Commit Message Format

Commit messages must follow the conventional commit format:

```
type(optional scope): subject
```

Where `type` is one of:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `build`: Changes to the build system
- `ci`: Changes to CI configuration
- `chore`: Regular maintenance tasks
- `revert`: Reverting a previous commit

Examples:
- `feat: add user authentication`
- `fix(api): handle edge case in payment processing`
- `docs: update API documentation`

## ESLint Rules

Important ESLint rules in this project include:

- No unused variables (except those prefixed with `_`)
- Warning for `any` type usage
- Ordered imports
- Consistent code formatting

## Disabling Rules

In rare cases, you may need to disable an ESLint rule for a specific line:

```typescript
// eslint-disable-next-line no-console
console.log('Important debugging information');
```

Or for a whole file (at the top of the file):

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
```

## IDE Integration

For the best development experience:

### VS Code

Install the following extensions:
- ESLint
- Prettier

Configure VS Code to format on save:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### WebStorm/IntelliJ IDEA

Configure ESLint and Prettier as follows:
1. Go to Preferences → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable ESLint and set it to run on save
3. Go to Preferences → Languages & Frameworks → JavaScript → Prettier
4. Enable Prettier and set it to run on save 