# Calligraphy 
(Visual Notes App) - React Native

> **A local-first visual note-taking application demonstrating enterprise-grade React Native architecture, state management, and performance optimization.**

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Core Requirements](#-core-requirements)
- [Advanced Features](#-advanced-features)
- [Technical Constraints](#-technical-constraints)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Evaluation Criteria](#-evaluation-criteria)
- [Deliverables](#-deliverables)
- [What is done?](#-what-is-done)

---

## 🎯 Project Overview

### Objective
Build a **local-first visual note-taking application** that demonstrates expertise in:
- React Native architecture
- State management
- Performance optimization
- Code quality

This project simulates real-world challenges faced in a senior engineering role.

### What You're Building
A simplified, offline-capable alternative to tools like **Excalidraw** or **Miro**, where users can:
- Create and organize diagrams and sketches
- Annotate with rich media
- Handle complex offline state management
- Optimize rendering performance with large datasets
- Follow enterprise-grade architecture patterns

---

## ✅ Core Requirements

### 1. Project Setup & Architecture
- ✓ Set up React Native project using **React Native CLI**
- ✓ Implement scalable folder structure (components, hooks, services, utils, types)
- ✓ Use **TypeScript** throughout with proper type definitions
- ✓ Include configuration system for environment-specific settings

### 2. Canvas Drawing System
Create a canvas where users can:
- Draw multiple shapes (Rectangle, Circle, Triangle)
- Free-hand drawing with touch gestures
- Pan and zoom using multi-touch gestures
- Select and drag shapes to reposition
- Resize shapes using corner handles
- Delete selected shapes

**Technical Considerations:**
- Use `react-native-gesture-handler` or `PanResponder`
- Efficient rendering for 50+ shapes without performance degradation
- Use `react-native-skia` or `react-native-svg`

### 3. Multi-Canvas Management & Navigation
Implement a canvas management system:
- Create multiple independent canvases/boards
- Each canvas supports 100+ shapes
- Gallery view with thumbnails
- Quick navigation with smooth transitions
- Search and filter by name, tags, or creation date
- Batch operations (duplicate, delete, archive)

**Technical Considerations:**
- Lazy load canvas data (only active canvas in memory)
- Generate and cache thumbnails efficiently
- Virtualized list for canvas gallery
- State persistence without memory issues

### 4. Advanced State Management & Data Persistence
- Use **Zustand** for state management
- Command pattern for undo/redo (minimum 10 steps per canvas)
- Efficient state hydration/rehydration on app launch
- **Offline-first**: All data stored locally using **MMKV**
- Incremental saves (only persist changed data)
- Auto-save with conflict resolution
- Data migration strategy for app updates
- Export/import functionality for backup (JSON)

### 5. Performance Optimization
Demonstrate senior-level optimization:
- Memoization (`React.memo`, `useMemo`, `useCallback`)
- Virtualization for canvas gallery (`FlatList` optimization)
- Lazy loading of canvas data
- Efficient serialization (optimize JSON operations)
- Performance monitoring using React Native's Performance API
- Measure and optimize MMKV read/write operations
- FPS counter and memory usage display in dev mode
- Document optimization strategies and benchmarks in README

### 6. User Interface & Experience
- Clean, intuitive toolbar for drawing modes
- Shape property panel (color, opacity, border width)
- Mini-map showing full canvas overview
- Loading states and error boundaries
- Responsive design (tablets and phones)
- Dark mode support

**Styling:**
- Use StyleSheet, styled-components, or TailwindCSS (NativeWind)
- Follow consistent design tokens (colors, spacing, typography)

### 7. Code Quality & Architecture
- **Clean Architecture**: Separate business logic from UI
- **Custom Hooks**: Extract reusable logic
- **Error Handling**: Comprehensive try-catch blocks
- **Type Safety**: Leverage TypeScript advanced features (generics, discriminated unions, utility types)
- **Code Comments**: Document complex algorithms
- **Naming Conventions**: Clear, self-documenting names

### 8. Testing
- Unit tests for critical business logic (Jest)
- At least one integration test
- Test coverage report in README

---

## 🚀 Advanced Features

### A. Performance Profiling Dashboard
In-app developer menu showing:
- Real-time FPS counter
- Memory usage graph
- MMKV operation metrics (read/write times)
- Canvas render time analytics
- State tree size visualization

### B. Shape Grouping & Layers
- Group multiple shapes
- Layer management (bring to front, send to back)
- Nested groups support
- Lock/unlock layers

### C. Advanced Export & Backup
- Export canvas as PNG/SVG/PDF
- Share via native share sheet
- Full backup/restore of all app data
- Selective canvas import/export
- Cloud sync preparation (architecture only)

### D. Template System
- Pre-built canvas templates (flowchart, wireframe, mind map)
- Save custom canvases as templates
- Template gallery with preview
- Clone canvas from template

### E. Advanced Gesture Recognition
- Two-finger diagonal gesture → Rectangle
- Circular gesture → Circle
- Long press → Context menu
- Pinch on shape → Resize
- Haptic feedback for all gestures

### F. Annotation & Rich Content
- Text labels on shapes
- Attach images from camera/gallery
- Sticky notes with rich text
- Link shapes with arrows (flowchart style)
- Image compression and caching

---

## ⚡ Technical Constraints

| Constraint | Target |
|------------|--------|
| **Performance** | 60 FPS with 50+ shapes on screen |
| **Storage Efficiency** | Optimize data structure to minimize MMKV footprint |
| **Cold Start Time** | Launch and display last canvas within 2 seconds |
| **Memory** | No leaks, handle 10+ canvases without crashes |
| **Bundle Size** | Keep JavaScript bundle under 5MB (optional) |
| **TypeScript** | Strict mode enabled, no `any` without justification |
| **Offline-First** | 100% offline, no internet required |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 20
- React Native development environment set up ([Guide](https://reactnative.dev/docs/set-up-your-environment))
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Installation

```bash
# Install dependencies
npm install

# iOS only: Install CocoaPods dependencies
cd ios && bundle install && bundle exec pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Development Scripts

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check
```

---

## 📁 Project Structure

```
calligraphy/
├── src/
│   ├── commands/           # Command pattern for undo/redo
│   ├── core/               # Core services and infrastructure
│   │   ├── config/         # App configuration
│   │   ├── performance/    # Performance monitoring
│   │   └── storage/        # MMKV storage and migrations
│   ├── features/           # Feature-based modules
│   │   ├── canvas/         # Canvas drawing engine
│   │   ├── canvasManager/  # Multi-canvas management
│   │   ├── editor/         # Editor UI and tools
│   │   ├── export/         # Export functionality
│   │   └── performance/    # Performance profiling
│   ├── navigation/         # Navigation configuration
│   ├── shared/             # Shared components, hooks, utils
│   └── theme/              # Design system (colors, spacing, typography)
├── App.tsx                 # Application entry point
└── package.json
```

---

## 📊 Evaluation Criteria

Your submission will be assessed on:

### Architecture & Design (30%)
- Separation of concerns
- Scalability of the solution
- Reusability of components
- State management pattern implementation

### Code Quality (25%)
- TypeScript usage and type safety
- Clean code principles (SOLID, DRY, KISS)
- Error handling
- Naming conventions and readability

### Performance (20%)
- Rendering optimization
- Memory management
- Bundle size optimization
- Profiling evidence

### Feature Completeness (15%)
- All core requirements met
- At least 2 advanced features implemented
- Working undo/redo system
- Gesture handling

### Documentation (10%)
- Quality of README
- Code comments
- Architectural decisions explained
- Setup instructions clarity

---

## 📦 Deliverables

### 1. GitHub Repository
- Private repository with clear commit history
- Meaningful commit messages (conventional commits format)
- Feature branches merged to main (optional)

### 2. Comprehensive README.md
- Project overview
- Setup instructions
- Architecture documentation
- Performance benchmarks
- Test coverage report

### 3. Code Documentation
- JSDoc comments for complex functions
- README in each major folder
- Inline comments for non-obvious logic

### 4. Running Application
- Runs without errors on iOS and/or Android
- `.env.example` if environment variables are used

---

## 🎁 Bonus Points

- **Production Readiness**: CI/CD configuration (GitHub Actions)
- **Accessibility**: Screen reader support, proper labels
- **Internationalization**: Multi-language support setup
- **Analytics Integration**: Event tracking structure
- **Crash Reporting**: Integration structure (e.g., Sentry)
- **E2E Testing**: Detox or Maestro test examples

---

## 💡 What is done?

This project reflects real-world scenarios:
- **Offline-first architecture** common in production mobile apps
- **Complex state management** with multiple data entities
- **Performance optimization** with large local datasets
- **Data persistence strategies** and migration handling
- **Architectural decisions** with tradeoffs (storage vs. memory, lazy loading)
- **User experience challenges** when working with local-only data

---
 All rights reserved.