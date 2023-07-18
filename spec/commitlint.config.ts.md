# commitlint.config.ts

The `commitlint.config.ts` file is used to configure the commitlint tool, which is a popular commit message linter. It helps enforce consistent commit message conventions in a project.

## Installation

To use commitlint in your project, you need to install the following npm packages:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

## Configuration

Create a `commitlint.config.ts` file in the root of your project with the following content:

```typescript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

This configuration extends the `@commitlint/config-conventional` preset, which provides a set of conventional commit message rules.

## Commit Message Format

Commit messages should follow the conventional commit format. The format consists of a type, an optional scope, and a message:

```
<type>(<scope>): <message>
```

The type can be one of the following:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (e.g., formatting)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Other changes that don't modify the source code

The scope is optional and represents the module or component affected by the commit.

The message should be a concise description of the changes made in the commit.

## Examples

Here are some examples of valid commit messages:

```
feat(user): Add user registration feature
fix(auth): Fix login form validation
docs(readme): Update project description
style: Format code using Prettier
refactor(api): Refactor API endpoints
test: Add unit tests for utils module
chore: Update dependencies
```

## Usage

To enforce commit message conventions, you can add a `commitmsg` script to your `package.json` file:

```json
{
  "scripts": {
    "commitmsg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

This script will be executed automatically when you run `git commit`, and it will validate the commit message against the configured rules.

## Conclusion

By using commitlint and following the conventional commit format, you can ensure consistent and meaningful commit messages in your project. This helps improve collaboration and maintainability.
