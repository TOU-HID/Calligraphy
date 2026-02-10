# Core

This folder contains core infrastructure and low-level services.

## Structure

```
core/
├── storage/        # Data persistence layer (MMKV)
├── performance/    # Performance monitoring utilities
└── config/         # App configuration and constants
```

## Modules

### storage

- **MMKVStorage.ts**: MMKV wrapper and storage keys
- **StorageService.ts**: Type-safe CRUD operations
- **migrations/**: Data migration system

### performance

Performance monitoring and metrics collection utilities.

### config

- **constants.ts**: App-wide configuration constants
- **env.ts**: Environment-specific configuration (future)

## Guidelines

- Core modules should be framework-agnostic when possible
- Keep dependencies minimal
- Provide clear interfaces for all services
- Document breaking changes in migrations
