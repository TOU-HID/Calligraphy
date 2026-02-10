/**
 * Jest Test Setup
 * Runs before all test files
 */

// Mock native modules that require React Native TurboModules
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  gestureHandlerRootHOC: (component: React.ComponentType) => component,
}));

jest.mock('react-native-reanimated', () => ({
  useSharedValue: (value: unknown) => value,
  useAnimatedStyle: () => ({}),
  withSpring: (value: number) => value,
  withTiming: (value: number) => value,
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
  },
  interpolate: jest.fn(),
}));

jest.mock('@shopify/react-native-skia', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => children,
  useDrawingContext: () => ({}),
}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getAllKeys: jest.fn(() => []),
    clearAll: jest.fn(),
    remove: jest.fn(),
  }),
}));

// Suppress console output in tests
// eslint-disable-next-line no-console
console.log = jest.fn();
// eslint-disable-next-line no-console
console.debug = jest.fn();

