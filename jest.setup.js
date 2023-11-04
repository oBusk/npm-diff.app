import "@testing-library/jest-dom";

// Override the react.cache method to avoid caching in tests
jest.mock("react", () => {
    const React = jest.requireActual("react");
    React.cache = (fn) => fn;
    return React;
});

// Override untable_cache method to avoid caching in tests
jest.mock("next/cache", () => {
    const cache = jest.requireActual("next/cache");
    cache.unstable_cache = (fn) => fn;
    return cache;
});
