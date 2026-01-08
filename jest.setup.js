import "@testing-library/jest-dom";

// Override the react.cache method to avoid caching in tests
jest.mock("react", () => {
    const actual = jest.requireActual("react");
    return {
        ...actual,
        cache: (fn) => fn,
    };
});

// Override untable_cache method to avoid caching in tests
jest.mock("next/cache", () => ({
    unstable_cache: (fn) => fn,
    cacheLife: jest.fn(),
}));
