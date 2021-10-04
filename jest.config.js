module.exports = {
    roots: ["<rootDir>"],
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
    watchPlugins: [],
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    },
    testPathIgnorePatterns: ["<rootDir>[/\\\\](node_modules|.next)[/\\\\]"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$"],
};
