module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@features': './src/features',
          '@shared': './src/shared',
          '@core': './src/core',
          '@store': './src/store',
          '@commands': './src/commands',
          '@navigation': './src/navigation',
          '@theme': './src/theme',
          '@assets': './assets',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be last
  ],
};
