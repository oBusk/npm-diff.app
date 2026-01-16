import search from "./search";

export default function popularPackages(size: number) {
    /**
     * Using a hardcoded list as npms.io does not really tell us anything about popularity
     */
    const hardcodedList = [
        "react",
        "@angular/core",
        "typescript",
        "chalk",
        "express",
        "lodash",
        "vue",
        "axios",
        "jest",
        "webpack",
        "moment",
    ];

    return Promise.all(
        hardcodedList.slice(0, size).map((v) => search(v, 1)),
    ).then((results) => {
        const packages = results.flatMap((result) => result.results);
        return {
            total: packages.length,
            results: packages,
        };
    });
}
