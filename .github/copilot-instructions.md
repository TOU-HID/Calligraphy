# Copilot Instructions for Visual Notes App

## Project Overview

This is a **React Native TypeScript** application for visual note-taking with canvas drawing capabilities. The app uses:
- **Skia Canvas** for drawing (`@shopify/react-native-skia`)
- **Zustand** for state management (store not yet implemented)
- **React Navigation** for navigation (setup ready)
- **MMKV** for persistent storage
- **React Native Reanimated** for animations

**Current Phase:** Phase 1 (Setup) is complete. Phase 2 will implement canvas drawing system.

## Build, Test & Development Commands

### Core Commands
```bash
npm start                  # Start Metro dev server (required first)
npm run android           # Build and run on Android emulator/device
npm run ios              # Build and run on iOS simulator/device
npm run clean            # Clean build artifacts
```

### Testing
```bash
npm test                 # Run Jest test suite once
npm run test:watch      # Run Jest in watch mode
npm run test:coverage   # Generate coverage report
```

### Code Quality
```bash
npm run lint            # Check for linting errors
npm run lint:fix        # Auto-fix linting errors
npm run format          # Format code with Prettier
npm run format:check    # Check if code matches Prettier format
npm run typecheck       # Type-check without emitting (tsc)
```

### iOS-specific
```bash
bundle install          # Install CocoaPods (first time)
bundle exec pod install # Install/update iOS native dependencies
```

## Architecture & Project Structure

### Directory Layout
```
src/
├── core/              # Core services (storage, migrations, config)
├── features/          # Feature modules (to be built)
├── navigation/        # Navigation setup (ready)
├── shared/            # Shared utilities, hooks, components
├── store/             # Zustand stores (not yet implemented)
├── theme/             # Design tokens (colors, typography, spacing)
└── commands/          # Command utilities
```

### Key Architectural Patterns

#### Theme System
- **Location:** `src/theme/`
- Centralized design tokens: colors, typography, spacing
- Import tokens as: `import { colors } from '@theme'`

#### Storage & Persistence
- **Service:** `src/core/storage/` with MMKV backend
- **Migrations:** Auto-run on app init via `MigrationService`
- Data migrations handled at `App.tsx` initialization

#### Path Aliases
All imports use configured aliases (see `tsconfig.json`):
```typescript
@/*          → src/*
@features/*  → src/features/*
@shared/*    → src/shared/*
@core/*      → src/core/*
@store/*     → src/store/*
@commands/*  → src/commands/*
@navigation/*→ src/navigation/*
@theme/*     → src/theme/*
@assets/*    → assets/*
```

#### App Initialization Flow
1. App mounts → runs initialization in `useEffect`
2. `MigrationService.needsMigration()` checks if migrations required
3. `MigrationService.runMigrations()` applies pending migrations
4. Renders UI once initialization complete (or error state)

## Code Conventions & Patterns

### TypeScript Standards
- **Strict mode enabled** - No `any` types (error enforced)
- **Explicit return types** - All functions must declare return types
- **Interface naming:** Use `PascalCase` (not `IName` prefix)
- **Type aliases:** Use `PascalCase` for type names

### React Native & React Patterns
- **Functional components only** - No class components
- **Hooks must have explicit dependencies** - ESLint enforces `exhaustive-deps`
- **No default exports** - Use named exports for better tree-shaking
- **Component files:** Use `.tsx` for components, `.ts` for utilities

### Code Style
- **Print width:** 100 characters
- **Quotes:** Single quotes for strings
- **Semicolons:** Required
- **Trailing commas:** Required (all)
- **Arrow functions:** Always include parens `(x) => ...`
- **Indentation:** 2 spaces, no tabs

### Naming Conventions
- **Interfaces/Types:** `PascalCase`
- **Variables/constants:** `camelCase` (with `const` enforced)
- **Unused variables:** Prefix with `_` to suppress linter warnings
- **Imports:** Sort imports (enforced by ESLint)

### Console Usage
- Allowed: `console.warn()`, `console.error()`, `console.info()`
- Disallowed: `console.log()` in production code (testing only)

### Testing
- **Framework:** Jest
- **Test location:** `__tests__/` directory or co-located as `*.test.ts(x)`
- **Setup:** Files in `__tests__/setup.ts` run before all tests
- **Coverage threshold:** Minimum 60% (branches, functions, lines, statements)
- **Native module transforms:** jest.config.js excludes certain modules from transformation

## Important Files & Their Roles

| File | Purpose |
|------|---------|
| `App.tsx` | App entry point, initialization, loading state |
| `src/theme/` | Design tokens and theming |
| `src/core/storage/` | Data persistence layer |
| `src/core/storage/migrations/` | Database schema migrations |
| `tsconfig.json` | TypeScript strict config + path aliases |
| `.eslintrc.js` | Linting rules (TypeScript + React Native) |
| `.prettierrc.js` | Code formatting rules |
| `jest.config.js` | Test configuration with module mapping |

## Development Notes

### Common Tasks
- **Adding a new screen:** Create feature in `src/features/`, add to navigation
- **Creating reusable components:** Place in `src/shared/components/`
- **Adding utilities:** Use `src/shared/utils/`
- **Custom hooks:** Place in `src/shared/hooks/`
- **Persisting data:** Use `StorageService` from `@core/storage`

### Performance Considerations
- Reanimated & Skia require native module configuration
- MMKV is more performant than AsyncStorage for frequent reads/writes
- Module resolver (babel plugin) supports lazy loading patterns

### Git & Dependencies
- **Node version:** >=20 required
- **Package manager:** npm (lock file in repo)
- **Post-install:** `patch-package` runs automatically to handle native patches
