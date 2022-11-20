import "@testing-library/jest-dom/extend-expect";

// Override the react.cache method to avoid caching in tests
jest.mock("react", () => {
    const React = jest.requireActual("react");
    React.cache = (fn) => fn;
    return React;
});
