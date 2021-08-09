module.exports = {
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    coverageDirectory: "coverage",
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    },
};
