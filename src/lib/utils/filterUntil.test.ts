import filterUntil from "./filterUntil";

describe("filterUntil", () => {
    const evenPredicate = (x: number) => x % 2 === 0;
    let array: number[];

    beforeEach(() => {
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
});
