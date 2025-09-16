module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/android/",
    "<rootDir>/ios/",
    "<rootDir>/node_modules/",
    "<rootDir>/android/",
    "<rootDir>/ios/",
    "<rootDir>/src/test/setup.ts",
    "<rootDir>/src/test/testUtils.tsx",
    "<rootDir>/src/test/__mocks__/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|@shopify|@tanstack|expo|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@expo|expo-router|expo-constants|expo-font|expo-linking|expo-splash-screen|expo-status-bar|expo-system-ui|expo-web-browser|expo-symbols|expo-blur|expo-document-picker|expo-haptics|expo-image|expo-notifications|react-native-toast-message|react-native-webview|react-native-worklets|@faker-js|@hookform|date-fns|zod|zustand)/)",
  ],
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(ttf|otf|eot|svg|woff|woff2)$": "identity-obj-proxy",
    "^@expo/vector-icons/(.*)$":
      "<rootDir>/src/test/__mocks__/@expo/vector-icons.js",
    "^@react-navigation/native$":
      "<rootDir>/src/test/__mocks__/@react-navigation/native.js",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/test/**"],
  testMatch: [
    "**/__tests__/**/*.(ts|tsx|js)",
    "**/*.(test|spec).(ts|tsx|js)",
    "**/src/test/**/*.(test|spec).(ts|tsx|js)",
  ],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx",
      },
    },
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
