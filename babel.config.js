module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'nativewind/babel',
  ],
  // zod v4 ships `export * as ns from ...`, which Metro's preset doesn't
  // transform by default. This plugin handles that syntax.
  plugins: ['@babel/plugin-transform-export-namespace-from'],
};
