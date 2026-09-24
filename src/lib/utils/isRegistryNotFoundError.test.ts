import isRegistryNotFoundError from "./isRegistryNotFoundError";

describe("isRegistryNotFoundError", () => {
    it.each(["E404", "ETARGET"])("is true for code %p", (code) => {
        expect(
            isRegistryNotFoundError(Object.assign(new Error("x"), { code })),
        ).toBe(true);
    });

    it.each([
        new Error("x"),
        Object.assign(new Error("x"), { code: "ECONNRESET" }),
        null,
        "E404",
    ])("is false for %p", (error) => {
        expect(isRegistryNotFoundError(error)).toBe(false);
    });
});
