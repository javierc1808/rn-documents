# 🔒 Pre-commit Hook Configuration

This project is configured with a pre-commit hook that **requires** certain standards to be met before allowing commits.

## ✅ Required Checks

### 1. 🔧 Expo Doctor

- Verifies that the Expo project configuration is correct
- Runs: `npx expo-doctor`

### 2. 🔍 TypeScript Type Check

- Verifies there are no type errors
- Runs: `npm run typecheck`

### 3. 🧹 ESLint

- Verifies code follows style rules
- Runs: `npm run lint`

### 4. 📝 Lint-staged

- Runs linting and formatting only on staged files
- Runs: `npx lint-staged`

### 5. 🧪 Tests with Coverage (80% minimum)

- Runs all tests
- Verifies coverage is >= 80% in:
  - Statements
  - Branches
  - Functions
  - Lines
- Runs: `npm run test:coverage:threshold`

## 🚫 What happens if it fails?

If any check fails, the commit will be **cancelled** and you'll see a message like:

```
❌ Commit cancelled: [Failure reason]
💡 [Suggestion to fix]
```

## 🛠️ Useful Commands

```bash
# Run all checks manually
npm run test:coverage:threshold

# Fix linting issues automatically
npm run lint:fix

# See full coverage report
npm run test:coverage

# Run only tests
npm test

# Run typecheck
npm run typecheck

# Run lint
npm run lint
```

## 📊 Current Coverage Status

- **Statements**: 83.67% ✅
- **Branches**: 70.11% ❌ (needs 80%)
- **Functions**: 82.35% ✅
- **Lines**: 84.08% ✅

## 🔧 Configuration

- **Husky**: For managing git hooks
- **Lint-staged**: For running linting only on staged files
- **Jest**: For testing and coverage
- **ESLint**: For linting
- **TypeScript**: For type checking

## 📁 Configuration Files

- `.husky/pre-commit`: Pre-commit hook
- `jest.config.js`: Jest configuration with thresholds
- `package.json`: Scripts and lint-staged configuration
- `eslint.config.js`: ESLint configuration

---

**Note**: To make commits, ensure all tests pass and coverage is >= 80%. If you need to make an urgent commit, you can use `git commit --no-verify` (not recommended).
