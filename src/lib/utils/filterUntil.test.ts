import filterUntil from "./filterUntil";

describe("filterUntil", () => {
    let predicateRuns = 0;
    let evenPredicate: (x: number) => boolean;
    let array: number[];

    beforeEach(() => {
        predicateRuns = 0;
        evenPredicate = (x: number) => {
            predicateRuns++;
            return x % 2 === 0;
        };
        array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    });

    it("Uses predicate to find matches", () => {
        const result = filterUntil(array, evenPredicate, 100);
        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it("Only matches until maxNumhits is reached", () => {
        const result = filterUntil(array, evenPredicate, 2);
        expect(result).toEqual([2, 4]);
    });

    it("Stops running predicate after matching maxNumhits", () => {
        filterUntil(array, evenPredicate, 3);
        // 1, (2), 3, (4), 5, (6) = 3 evens, 6 runs
        expect(predicateRuns).toBe(6);
    });

    it("returns without running predicate if input array is []", () => {
        filterUntil([], evenPredicate, 3);
        expect(predicateRuns).toBe(0);
    });

    it("returns without running predicate if size is 0", () => {
        filterUntil(array, evenPredicate, 0);
        expect(predicateRuns).toBe(0);
    });
});
