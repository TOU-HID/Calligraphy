# Features

This folder contains feature modules organized by domain functionality.

## Structure

Each feature follows a consistent structure:

```
feature/
├── components/     # UI components specific to this feature
├── hooks/          # Custom hooks for feature logic
├── services/       # Business logic and data operations
├── types/          # TypeScript type definitions
└── utils/          # Utility functions for this feature
```

## Features

### canvas

Core canvas drawing functionality including shape rendering, gestures, and viewport management.

### canvasManager

Multi-canvas management including list view, thumbnails, search, and batch operations.

### editor

Shape editing functionality including properties panel, color picker, and manipulation tools.

### export

Export and backup functionality for canvases and app data.

### performance

Performance monitoring and profiling dashboard for development.

## Guidelines

- Keep feature modules independent and loosely coupled
- Shared functionality should go in `/shared`
- Use barrel exports (index.ts) for clean imports
- Follow the established folder structure for consistency
