import { selectCrawlableDiffs } from "./crawlableDiffs";

describe("selectCrawlableDiffs", () => {
    it("picks the latest major and minor bump", () => {
        expect(
            selectCrawlableDiffs("pkg", [
                "1.0.0",
                "1.1.0",
                "1.1.1",
                "2.0.0",
                "2.1.0",
                "2.1.1",
            ]),
        ).toEqual(["/pkg@1.1.1...pkg@2.0.0", "/pkg@2.0.0...pkg@2.1.0"]);
    });

    it("returns nothing for a single version", () => {
        expect(selectCrawlableDiffs("pkg", ["1.0.0"])).toEqual([]);
    });

    it("skips bump types that don't exist", () => {
        expect(selectCrawlableDiffs("pkg", ["1.0.0", "1.0.1"])).toEqual([]);
    });
});
